import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation(){
  const { user, logout } = useAuth();
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <h2>Wexa Helpdesk</h2>
      {user && (
        <div>
          <span style={{ marginRight: 12 }}>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
