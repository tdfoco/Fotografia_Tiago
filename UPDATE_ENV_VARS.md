# Atualização das Variáveis de Ambiente - Instruções

## ✅ PASSO 1: .env Local (CONCLUÍDO)

Adicionei `VITE_POCKETBASE_URL=https://db.tdfoco.cloud` ao seu `.env` local.

Para verificar, execute:
```bash
cat .env | grep POCKETBASE
```

## 📦 PASSO 2: Atualizar Vercel

### Opção A: Via Interface Web (Recomendado)

1. Acesse: https://vercel.com/
2. Clique no seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Procure por `VITE_POCKETBASE_URL`
   - Se já existe: clique em **Edit** → mude para `https://db.tdfoco.cloud` → **Save**
   - Se não existe: clique em **Add New** → preencha:
     - Key: `VITE_POCKETBASE_URL`
     - Value: `https://db.tdfoco.cloud`
     - Environments: ✅ Production, ✅ Preview, ✅ Development
     - **Save**
5. Vá em **Deployments**
6. Clique nos **3 pontinhos** do último deploy → **Redeploy**

### Opção B: Via CLI (Mais Rápido)

No seu terminal (PowerShell), execute:

```powershell
# 1. Logar no Vercel (se não estiver logado)
vercel login

# 2. Adicionar/atualizar variável
vercel env add VITE_POCKETBASE_URL production
# Quando pedir o valor, digite: https://db.tdfoco.cloud

vercel env add VITE_POCKETBASE_URL preview
# Digite: https://db.tdfoco.cloud

# 3. Fazer redeploy
vercel --prod
```

## 🧪 PASSO 3: Testar

### 3.1 - Testar Localmente
```bash
npm run dev
```
- Acesse: http://localhost:5173
- Verifique se os dados carregam
- Abra o DevTools Console e veja se há erros

### 3.2 - Testar em Produção
- Aguarde o deploy do Vercel terminar
- Acesse: https://tdfoco.cloud
- Teste:
  - ✅ Carregamento de fotos
  - ✅ Login admin (/admin)
  - ✅ Upload de imagens
  - ✅ Comentários

## 🔍 Verificação do PocketBase

**Admin Panel:**
- URL: https://db.tdfoco.cloud/_/
- Email: td.foco@gmail.com
- Senha: luatd010101

**API Status:**
```bash
curl https://db.tdfoco.cloud/api/health
```

---

## 🎉 Quando tudo estiver funcionando

Você pode remover as variáveis antigas do Supabase do `.env` e do Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

E também pode desinstalar o pacote do Supabase:
```bash
npm uninstall @supabase/supabase-js
```
