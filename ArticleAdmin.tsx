import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

type Article = { _id: string; title: string; published: boolean; content?: string };

export default function ArticleAdmin(){
  const [list, setList] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');

  async function load(){ setList(await api<Article[]>('/api/articles')); }

  useEffect(()=>{ load(); },[]);

  async function create(e: React.FormEvent){
    e.preventDefault();
    setMsg('');
    await api('/api/articles', { method:'POST', body: JSON.stringify({ title, content, published: false }) });
    setTitle(''); setContent('');
    setMsg('Article created');
    load();
  }

  async function publish(id: string){ await api(`/api/articles/${id}/publish`, { method: 'PATCH' }); load(); }
  async function unpublish(id: string){ await api(`/api/articles/${id}/unpublish`, { method: 'PATCH' }); load(); }
  async function remove(id: string){ await api(`/api/articles/${id}`, { method: 'DELETE' }); load(); }

  return (
    <div>
      <h3>Articles (admin)</h3>
      <form onSubmit={create} style={{ marginBottom: 12 }}>
        <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="content" value={content} onChange={e=>setContent(e.target.value)} />
        <button type="submit">Create</button>
        {msg && <span style={{ marginLeft: 8 }}>{msg}</span>}
      </form>
      <ul>
        {list.map(a => (
          <li key={a._id}>
            {a.title} — {a.published ? 'published' : 'draft'}
            {' '}
            {a.published
              ? <button onClick={()=>unpublish(a._id)}>Unpublish</button>
              : <button onClick={()=>publish(a._id)}>Publish</button>}
            {' '}
            <button onClick={()=>remove(a._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
