import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CatalogPage } from './components/CatalogPage';
import './index.css';

interface AuthUser {
  email: string;
  password: string;
  name: string;
  status?: string;
}

function CatalogApp() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const catalogUser = localStorage.getItem('catalogUser');
    console.log('Checking catalogUser:', catalogUser);
    if (catalogUser) {
      try {
        const userData = JSON.parse(catalogUser);
        console.log('Parsed user data:', userData);
        console.log('User status:', userData.status);
        if (userData.status === 'approved') {
          setUser(userData);
        } else {
          console.log('User status not approved, redirecting to auth');
          localStorage.removeItem('catalogUser');
          window.location.href = '/auth.html';
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = '/auth.html';
      }
    } else {
      console.log('No catalogUser in localStorage, redirecting to auth');
      window.location.href = '/auth.html';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('catalogUser');
    window.location.href = '/';
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return <CatalogPage user={user} onLogout={handleLogout} onBack={handleBack} />;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <CatalogApp />
    </React.StrictMode>
  );
}