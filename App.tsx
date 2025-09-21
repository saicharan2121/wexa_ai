import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import TicketList from './components/TicketList';
import CreateTicket from './components/CreateTicket';
import ArticleList from './components/ArticleList';
import ArticleAdmin from './components/ArticleAdmin';
import AgentBox from './components/AgentBox';

function AppInner(){
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return <Login />;

  return (
    <div style={{ padding: 16 }}>
      <Navigation />
      <hr />
      <CreateTicket onCreated={()=>setRefreshKey(k=>k+1)} />
      <div key={refreshKey}>
        <TicketList />
      </div>
      <hr />
      <ArticleList />
      <hr /> <ArticleAdmin />
      <hr /> <AgentBox />
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
