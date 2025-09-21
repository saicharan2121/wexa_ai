import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

type Article = { _id: string; title: string; published: boolean };

export default function ArticleList(){
  const [list, setList] = useState<Article[]>([]);

  async function load(){ setList(await api<Article[]>('/api/articles')); }
  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <h3>Articles</h3>
      <ul>
        {list.map(a => <li key={a._id}>{a.title} — {a.published ? 'published' : 'draft'}</li>)}
      </ul>
    </div>
  );
}
