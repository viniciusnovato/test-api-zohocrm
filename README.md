# Integração Zoho CRM OAuth2

Este projeto demonstra a integração OAuth2 com o Zoho CRM usando React + Vite no frontend e Node.js + Express no backend.

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm run install-all
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   ZOHO_CLIENT_ID=seu_client_id_aqui
   ZOHO_CLIENT_SECRET=seu_client_secret_aqui
   ZOHO_REDIRECT_URI=http://localhost:5000/auth/callback
   PORT=5000
   ```

4. Obtenha suas credenciais do Zoho CRM:
   - Acesse [Zoho API Console](https://api-console.zoho.com/)
   - Crie um novo Client ID
   - Configure a URI de redirecionamento como `http://localhost:5000/auth/callback`
   - Copie o Client ID e Client Secret para o arquivo `.env`

## Desenvolvimento

1. Para desenvolvimento, execute:
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

## Produção

1. Build do frontend:
   ```bash
   npm run build
   ```

2. Inicie o servidor:
   ```bash
   npm start
   ```

O aplicativo estará disponível em `http://localhost:5000`

## Funcionalidades

- Autenticação OAuth2 com Zoho CRM
- Armazenamento de tokens em memória
- Refresh automático do access_token
- Interface para visualização do status da conexão

## Estrutura do Projeto

```
.
├── client/             # Frontend React + Vite
│   ├── src/
│   └── dist/          # Build do frontend
├── server/            # Backend Node.js + Express
│   └── index.js      # Servidor Express
├── .env              # Variáveis de ambiente
└── package.json
``` 