import React, { useState } from 'react';
import { api } from '../services/api';

type Suggestion = {
  _id: string;
  prompt: string;
  suggestion: string;
  confidence: number;
  accepted: boolean;
  resolved: boolean;
};

export default function AgentBox(){
  const [ticketId, setTicketId] = useState('');
  const [prompt, setPrompt] = useState('Customer says UPI payment not reflected. Propose next steps.');
  const [text, setText] = useState('Collect UPI ref id, check gateway logs, reconcile within 24h.');
  const [conf, setConf] = useState(0.78);
  const [list, setList] = useState<Suggestion[]>([]);
  const [msg, setMsg] = useState('');

  async function create(e: React.FormEvent){
    e.preventDefault();
    if (!ticketId) return setMsg('Enter ticket id');
    setMsg('');
    await api(`/api/agent/${ticketId}/suggestions`, {
      method: 'POST',
      body: JSON.stringify({ prompt, suggestion: text, confidence: conf })
    });
    load();
  }

  async function load(){
    if (!ticketId) return;
    const data = await api<Suggestion[]>(`/api/agent/${ticketId}/suggestions`);
    setList(data);
  }

  async function mark(id: string){
    await api(`/api/agent/suggestions/${id}/outcome`, {
      method: 'PATCH',
      body: JSON.stringify({ accepted: true, resolved: true })
    });
    load();
  }

  return (
    <div>
      <h3>Agent suggestions</h3>
      <div style={{ marginBottom: 8 }}>
        <input placeholder="Ticket ID" value={ticketId} onChange={e=>setTicketId(e.target.value)} style={{ width: 260 }} />
        <button onClick={load} style={{ marginLeft: 8 }}>Load</button>
      </div>
      <form onSubmit={create} style={{ marginBottom: 12 }}>
        <input style={{ width: 320 }} value={prompt} onChange={e=>setPrompt(e.target.value)} />
        <input style={{ width: 320, marginLeft: 8 }} value={text} onChange={e=>setText(e.target.value)} />
        <input style={{ width: 80, marginLeft: 8 }} type="number" step="0.01" min="0" max="1" value={conf}
               onChange={e=>setConf(parseFloat(e.target.value))} />
        <button type="submit" style={{ marginLeft: 8 }}>Create</button>
        {msg && <span style={{ marginLeft: 8 }}>{msg}</span>}
      </form>
      <ul>
        {list.map(s => (
          <li key={s._id}>
            {s.suggestion} — conf {s.confidence} — {s.accepted ? 'accepted' : 'new'}
            {' '}<button onClick={()=>mark(s._id)}>Accept+Resolve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
