const axios = require('axios');

const ZOHO_API_BASE_URL = 'https://www.zohoapis.com/crm/v5';

async function getContacts(accessToken) {
  try {
    const response = await axios.get(`${ZOHO_API_BASE_URL}/Contacts`, {
      params: {
        per_page: 10,
        fields: 'Full_Name,Email,Phone'
      },
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    return {
      success: true,
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Erro ao buscar contatos:', error.response?.data || error.message);
    
    // Tratamento específico para erro de permissão
    if (error.response?.data?.code === 'NO_PERMISSION' && 
        error.response?.data?.details?.permissions?.includes('Crm_Implied_Api_Access')) {
      return {
        success: false,
        error: 'Usuário não possui permissão necessária para acessar contatos',
        details: error.response.data.details,
        code: error.response.data.code
      };
    }
    
    // Tratamento específico de erros da API
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Token expirado ou inválido'
      };
    }

    return {
      success: false,
      error: 'Erro ao buscar contatos do Zoho CRM',
      details: error.response?.data?.details,
      code: error.response?.data?.code
    };
  }
}

module.exports = {
  getContacts
}; 