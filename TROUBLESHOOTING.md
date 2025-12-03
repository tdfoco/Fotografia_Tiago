# 🚨 Problemas Identificados e Soluções

## Problema 1: DNS não configurado ❌

**Erro**: `db.tdfoco.cloud` retorna `DNS_PROBE_FINISHED_NXDOMAIN`

**Causa**: O registro DNS não foi criado no painel da Hostinger.

**Solução URGENTE**:
1. Acesse: https://hpanel.hostinger.com/
2. Vá em **Domains** → **tdfoco.cloud** → **DNS / Name Servers**
3. Clique em **Manage** ou **DNS Zone Editor**
4. Adicione um novo registro:
   ```
   Type: A
   Name: db
   Points to: 148.230.76.195
   TTL: 14400 (ou padrão)
   ```
5. Clique em **Add Record** ou **Save**
6. Aguarde 5-15 minutos para propagação

**Como verificar**:
```bash
nslookup db.tdfoco.cloud
# Deve retornar: Address: 148.230.76.195
```

---

## Problema 2: Vercel ainda usando Supabase ❌

**Erro**: Console do site mostra:
- `WebSocket connection to 'wss://sgzngykokmddmmqiilma.supabase.co/...' failed`
- `Failed to load resource: 401` nos endpoints Supabase
- `Error fetching hero images: Invalid API key`

**Causa**: O deploy do Vercel não está usando o código atualizado ou as novas variáveis de ambiente.

**Solução**:

### Opção A: Redeploy forçado (Recomendado)
```bash
# No seu terminal PowerShell:
vercel --prod --force
```

### Opção B: Via Interface Vercel
1. Acesse: https://vercel.com/
2. Vá no projeto
3. **Settings** → **Environment Variables**
4. Garanta que `VITE_POCKETBASE_URL` = `https://db.tdfoco.cloud` está em **Production**
5. Vá em **Deployments**
6. Clique nos **3 pontinhos** → **Redeploy**
7. ✅ Marque **Use existing Build Cache** como **OFF/unchecked**

---

## Checklist de Verificação

### Após configurar DNS:
- [ ] Aguardar 5-15 minutos
- [ ] Executar: `nslookup db.tdfoco.cloud`
- [ ] Verificar retorna `148.230.76.195`
- [ ] Testar: `curl -I https://db.tdfoco.cloud`
- [ ] Acessar: https://db.tdfoco.cloud/_/

### Após redeploy Vercel:
- [ ] Aguardar build concluir (1-2 minutos)
- [ ] Acessar: https://tdfoco.cloud
- [ ] Abrir DevTools Console (F12)
- [ ] Verificar se NÃOÁ mais erros do Supabase
- [ ] Verificar se hero image carrega
- [ ] Testar navegação (Photography, Design)

---

## URLs de Teste Rápido

**PocketBase Admin:**
```
https://db.tdfoco.cloud/_/
Login: td.foco@gmail.com
Senha: luatd010101
```

**Site Produção:**
```
https://tdfoco.cloud
```

**Local (após fix):**
```bash
npm run dev
# http://localhost:5173
```
