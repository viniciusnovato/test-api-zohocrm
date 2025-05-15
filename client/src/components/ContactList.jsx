import { useState, useEffect } from 'react';
import './ContactList.css';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPermissionError, setIsPermissionError] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsPermissionError(false);
      
      const response = await fetch('/api/contacts');
      const data = await response.json();
      
      if (!data.success) {
        // Verificar se é um erro específico de permissão
        if (data.error && data.error.includes('permissão') || 
            (data.details && data.details.permissions && 
             data.details.permissions.includes('Crm_Implied_Api_Access'))) {
          setIsPermissionError(true);
        }
        throw new Error(data.error);
      }
      
      setContacts(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="contact-list loading">
        <div className="loading-spinner"></div>
        <p>Carregando contatos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-list error">
        <div className="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        
        {isPermissionError ? (
          <>
            <h3 className="error-title">Erro de Permissão</h3>
            <p>Seu usuário não possui as permissões necessárias para acessar os contatos no Zoho CRM.</p>
            <div className="error-details">
              <p>Permissão necessária: <code>Crm_Implied_Api_Access</code></p>
              <p>Essa permissão precisa ser concedida por um administrador do Zoho CRM para sua conta.</p>
            </div>
            <div className="error-steps">
              <p><strong>Como resolver:</strong></p>
              <ol>
                <li>Entre em contato com o administrador do Zoho CRM da sua organização</li>
                <li>Solicite acesso à API do Zoho CRM (permissão <code>Crm_Implied_Api_Access</code>)</li>
                <li>Depois de receber o acesso, tente novamente</li>
              </ol>
            </div>
          </>
        ) : (
          <p>Erro: {error}</p>
        )}
        
        <button onClick={fetchContacts} className="retry-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '5px', verticalAlign: 'middle'}}>
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="contact-list empty">
        <div className="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
          </svg>
        </div>
        <p>Nenhum contato encontrado.</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      <h2>Contatos do Zoho CRM</h2>
      <div className="contacts-grid">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <h3>{contact.Full_Name || 'Nome não informado'}</h3>
            
            {contact.Email && (
              <p>
                <span className="contact-info-label">Email</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#777" style={{marginRight: '5px', verticalAlign: 'middle'}}>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                {contact.Email}
              </p>
            )}
            
            {contact.Phone && (
              <p>
                <span className="contact-info-label">Telefone</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#777" style={{marginRight: '5px', verticalAlign: 'middle'}}>
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                {contact.Phone}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactList; 