import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CatalogPage } from './components/CatalogPage';
import { supabase } from './lib/supabase';
import './index.css';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  status: string;
  is_admin?: boolean;
  company_name?: string;
  address?: string;
  phone_number?: string;
}

function CatalogApp() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const catalogUser = localStorage.getItem('catalogUser');
      if (!catalogUser) {
        window.location.href = '/auth.html';
        return;
      }

      try {
        const userData = JSON.parse(catalogUser) as AuthUser;

        const { data, error } = await supabase
          .from('catalog_users')
          .select('id, email, name, status, is_admin, company_name, address, phone_number')
          .eq('email', userData.email)
          .maybeSingle();

        if (error || !data) {
          localStorage.removeItem('catalogUser');
          window.location.href = '/auth.html';
          return;
        }

        if (data.status !== 'approved') {
          localStorage.removeItem('catalogUser');
          window.location.href = '/auth.html';
          return;
        }

        localStorage.setItem('catalogUser', JSON.stringify(data));
        setUser(data);
      } catch {
        localStorage.removeItem('catalogUser');
        window.location.href = '/auth.html';
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('catalogUser');
    window.location.href = '/';
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  if (isChecking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
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
