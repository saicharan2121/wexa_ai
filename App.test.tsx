import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import TicketList from './components/TicketList';
import CreateTicket from './components/CreateTicket';
import ArticleList from './components/ArticleList';

function AppInner(){
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return <Login />;

  return (
    <div style={{ padding: 16 }}>
      <Navigation />
      <hr />
      <CreateTicket onCreated={()=>setRefreshKey(k=>k+1)} />
      {/* key forces TicketList to reload when a ticket is created */}
      <div key={refreshKey}>
        <TicketList />
      </div>
      <hr />
      <ArticleList />
    </div>
  );
}

export default function App(){
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
