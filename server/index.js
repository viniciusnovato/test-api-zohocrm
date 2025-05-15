require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { getContacts } = require('./zoho-api');

const app = express();
const PORT = process.env.PORT || 5000;

// Tokens em memória
let tokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Nova rota para buscar contatos
app.get('/api/contacts', async (req, res) => {
  if (!tokens.access_token) {
    return res.status(401).json({
      success: false,
      error: 'Não autenticado. Por favor, conecte-se ao Zoho CRM primeiro.'
    });
  }

  const result = await getContacts(tokens.access_token);
  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// Rota para iniciar o fluxo OAuth
app.get('/auth/redirect', (req, res) => {
  const zohoAuthUrl = 'https://accounts.zoho.com/oauth/v2/auth';
  const params = new URLSearchParams({
    client_id: process.env.ZOHO_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.ZOHO_REDIRECT_URI,
    access_type: 'offline',
    scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoCRM.org.ALL',
    prompt: 'consent'
  });

  res.redirect(`${zohoAuthUrl}?${params.toString()}`);
});

// Callback do OAuth
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const tokenResponse = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        code,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        grant_type: 'authorization_code'
      }
    });

    console.log('📦 Resposta completa do Zoho na troca de token:');
    console.log(tokenResponse.data);

    tokens = {
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token,
      expires_at: Date.now() + (tokenResponse.data.expires_in * 1000)
    };

    res.redirect('/');
  } catch (error) {
    console.error('Erro ao obter tokens:', error.response?.data || error.message);
    res.status(500).json({ error: 'Falha na autenticação' });
  }
});

// Status da conexão
app.get('/api/zoho-status', (req, res) => {
  res.json({
    connected: !!tokens.access_token,
    expires_at: tokens.expires_at
  });
});

// Middleware para refresh automático do token
app.use(async (req, res, next) => {
  if (!tokens.access_token || !tokens.expires_at) return next();

  // Refresh token se estiver próximo de expirar (5 minutos antes)
  if (Date.now() > tokens.expires_at - 300000) {
    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
        params: {
          refresh_token: tokens.refresh_token,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: 'refresh_token'
        }
      });

      tokens = {
        ...tokens,
        access_token: response.data.access_token,
        expires_at: Date.now() + (response.data.expires_in * 1000)
      };
    } catch (error) {
      console.error('Erro ao atualizar token:', error.response?.data || error.message);
    }
  }
  next();
});

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 