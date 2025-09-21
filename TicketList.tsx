import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

type Ticket = { _id: string; title: string; status: string };

export default function TicketList(){
  const [list, setList] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try{
      const data = await api<Ticket[]>('/api/tickets');
      setList(data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <h3>Tickets</h3>
      {loading && <div>Loading...</div>}
      <ul>
        {list.map(t => <li key={t._id}>{t.title} — {t.status}</li>)}
      </ul>
    </div>
  );
}
