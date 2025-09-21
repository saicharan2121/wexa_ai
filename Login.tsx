import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@wexa.com');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent){
    e.preventDefault();
    console.log('Submitting login');
    setErr('');
    try{
      await login(email, password);
    }catch(e){ setErr('Login failed'); }
  }

  return (
    <div style={{ maxWidth: 360, margin: '40px auto' }}>
      <h3>Login</h3>

      <form onSubmit={submit}>
        <input style={{ width:'100%', margin:'6px 0' }} value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input style={{ width:'100%', margin:'6px 0' }} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        <button type="submit" style={{ width:'100%', marginTop: 8 }}>Sign in</button>
      </form>
      {err && <div style={{ color:'red' }}>{err}</div>}
    </div>
  );
}
