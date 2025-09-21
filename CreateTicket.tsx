import React, { useState } from 'react';
import { api } from '../services/api';

export default function CreateTicket({ onCreated }: { onCreated: () => void }){
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState('');

  async function create(e: React.FormEvent){
    e.preventDefault();
    setMsg('');
    await api('/api/tickets', { method:'POST', body: JSON.stringify({ title, description: desc, category:'other' }) });
    setTitle(''); setDesc('');
    setMsg('Ticket created');
    onCreated();
  }

  return (
    <form onSubmit={create} style={{ marginBottom: 12 }}>
      <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} />
      <button type="submit">Create</button>
      {msg && <span style={{ marginLeft: 8 }}>{msg}</span>}
    </form>
  );
}
