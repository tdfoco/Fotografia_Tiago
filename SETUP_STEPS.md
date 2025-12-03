# Guia Passo a Passo - Configuração do Reverse Proxy

## PASSO 1: Configurar DNS (Hostinger)

1. Acesse: https://hpanel.hostinger.com/
2. Vá em **Domains** → **tdfoco.cloud** → **DNS / Name Servers**
3. Clique em **Add New Record**
4. Preencha:
   - **Type**: A
   - **Name**: db
   - **Points to**: 148.230.76.195
   - **TTL**: 14400 (ou deixe padrão)
5. Clique em **Add Record**

⏱️ **Aguarde 5-10 minutos** para propagação do DNS.

## PASSO 2: Verificar DNS (Seu Terminal Local)

No PowerShell/CMD do Windows, execute:
```powershell
nslookup db.tdfoco.cloud
```

Deve retornar: `Address: 148.230.76.195`

## PASSO 3: Executar Script no VPS

No seu terminal SSH que já está aberto (`root@148.230.76.195`), execute os comandos abaixo **um por um**:

### 3.1 - Instalar Nginx e Certbot
```bash
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx
```

### 3.2 - Criar configuração do Nginx
```bash
cat > /etc/nginx/sites-available/pocketbase << 'EOF'
server {
    listen 80;
    server_name db.tdfoco.cloud;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        client_max_body_size 50M;
    }
}
EOF
```

### 3.3 - Habilitar configuração
```bash
ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3.4 - Configurar SSL (Let's Encrypt)
```bash
certbot --nginx -d db.tdfoco.cloud --non-interactive --agree-tos --email td.foco@gmail.com --redirect
```

## PASSO 4: Testar Acesso

1. No navegador, acesse: **https://db.tdfoco.cloud/_/**
2. Faça login:
   - Email: `td.foco@gmail.com`
   - Senha: `luatd010101`

## PASSO 5: Atualizar Variáveis de Ambiente

### 5.1 - Local (.env)
Abra o arquivo `.env` e atualize:
```
VITE_POCKETBASE_URL=https://db.tdfoco.cloud
```

### 5.2 - Vercel
1. Acesse: https://vercel.com/
2. Vá no seu projeto → **Settings** → **Environment Variables**
3. Encontre `VITE_POCKETBASE_URL`
4. Clique em **Edit** e mude para: `https://db.tdfoco.cloud`
5. Clique em **Save**
6. Vá em **Deployments** → clique nos 3 pontinhos do último deploy → **Redeploy**

## PASSO 6: Testar Aplicação

### Localmente:
```bash
npm run dev
```
Acesse: http://localhost:5173 e verifique se os dados carregam.

### Produção:
Acesse: https://tdfoco.cloud e verifique se tudo funciona.

---

## ⚠️ Troubleshooting

**Se o Certbot falhar com "DNS not found":**
- Aguarde mais tempo (pode levar até 1 hora)
- Verifique o DNS novamente com `nslookup db.tdfoco.cloud`

**Se o Nginx não iniciar:**
```bash
nginx -t  # Ver erros
systemctl status nginx  # Ver status
journalctl -xe  # Ver logs
```

**Se aparecer 502 Bad Gateway:**
```bash
systemctl status pocketbase  # Verificar se PocketBase está rodando
netstat -tlnp | grep 8090  # Verificar se porta 8090 está aberta
```
