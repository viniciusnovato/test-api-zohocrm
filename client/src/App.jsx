import { useState, useEffect } from 'react'
import ContactList from './components/ContactList'
import './App.css'

function App() {
  const [status, setStatus] = useState({
    connected: false,
    expires_at: null
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/zoho-status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleConnect = () => {
    window.location.href = '/auth/redirect';
  };

  // Calcula o tempo restante para expiração do token
  const getRemainingTime = () => {
    if (!status.expires_at) return null;
    
    const now = Date.now();
    const expiresAt = status.expires_at;
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'Expirado';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="container">
      <div className="app-header">
        <h1>INTEGRAÇÃO ZOHO CRM COM MEDICAPILAR</h1>
        <div className="logos-container">
          <img 
            src="https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg" 
            alt="Zoho Logo" 
            className="partner-logo zoho-logo"
          />
          <span className="logo-separator">+</span>
          <img 
            src="https://www.medicapilar.pt/wp-content/uploads/2023/02/logo-medicapilar.svg" 
            alt="MedicaPilar Logo" 
            className="partner-logo medicapilar-logo"
          />
        </div>
      </div>
      
      <div className="status-card">
        <h2>Status da Conexão</h2>
        <p>
          Status: <span className={status.connected ? 'connected' : 'disconnected'}>
            {status.connected ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '5px'}}>
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Conectado
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '5px'}}>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                Desconectado
              </>
            )}
          </span>
        </p>
        {status.expires_at && (
          <p>
            Expira em: <span className="expires-time">{getRemainingTime()}</span>
          </p>
        )}
        
        {!status.connected && (
          <button onClick={handleConnect} className="connect-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            Conectar com Zoho CRM
          </button>
        )}
      </div>

      {status.connected && <ContactList />}
    </div>
  )
}

export default App
