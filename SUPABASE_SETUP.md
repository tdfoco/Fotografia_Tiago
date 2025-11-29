# 🚀 Guia de Configuração do Supabase

Este guia detalha todos os passos necessários para configurar o Supabase para o seu portfólio.

## 📋 Índice
1. [Criar Conta e Projeto](#1-criar-conta-e-projeto)
2. [Configurar Banco de Dados](#2-configurar-banco-de-dados)
3. [Configurar Storage](#3-configurar-storage)
4. [Obter Credenciais](#4-obter-credenciais)
5. [Configurar Aplicação](#5-configurar-aplicação)
6. [Testar](#6-testar)

---

## 1. Criar Conta e Projeto

### 1.1 Criar Conta
1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub, Google ou email

### 1.2 Criar Novo Projeto
1. No dashboard, clique em **"New Project"**
2. Preencha os dados:
   - **Name**: `portfolio-tiago` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **guarde-a com segurança**
   - **Region**: Escolha a região mais próxima do Brasil (ex: `South America (São Paulo)`)
3. Clique em **"Create new project"**
4. Aguarde alguns minutos enquanto o projeto é criado

---

## 2. Configurar Banco de Dados

### 2.1 Acessar o SQL Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### 2.2 Criar Tabela de Fotografia
Cole e execute o seguinte SQL:

```sql
-- Criar tabela de fotografia
CREATE TABLE photography (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text CHECK (category IN ('portraits', 'urban', 'nature', 'art', 'events')),
  url text NOT NULL,
  description text,
  year integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública de fotografia" 
ON photography FOR SELECT 
USING (true);

-- Política para permitir inserção apenas para usuários autenticados
CREATE POLICY "Permitir inserção para usuários autenticados" 
ON photography FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização para usuários autenticados" 
ON photography FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Política para permitir deleção apenas para usuários autenticados
CREATE POLICY "Permitir deleção para usuários autenticados" 
ON photography FOR DELETE 
USING (auth.role() = 'authenticated');
```

### 2.3 Criar Tabela de Projetos de Design
Cole e execute o seguinte SQL:

```sql
-- Criar tabela de projetos de design
CREATE TABLE design_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text CHECK (category IN ('logos', 'visual_identity', 'social_media', 'posters', 'special')),
  description text NOT NULL,
  images text[] NOT NULL,
  client text,
  year integer,
  link text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública de projetos" 
ON design_projects FOR SELECT 
USING (true);

-- Política para permitir inserção apenas para usuários autenticados
CREATE POLICY "Permitir inserção de projetos para usuários autenticados" 
ON design_projects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização de projetos para usuários autenticados" 
ON design_projects FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Política para permitir deleção apenas para usuários autenticados
CREATE POLICY "Permitir deleção de projetos para usuários autenticados" 
ON design_projects FOR DELETE 
USING (auth.role() = 'authenticated');
```

### 2.4 Verificar Tabelas
1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver as tabelas `photography` e `design_projects`

---

## 3. Configurar Storage

### 3.1 Criar Bucket para Fotografia
1. No menu lateral, clique em **"Storage"**
2. Clique em **"Create a new bucket"**
3. Preencha:
   - **Name**: `photography`
   - **Public bucket**: ✅ **Ativar** (marque a caixa)
4. Clique em **"Create bucket"**

### 3.2 Configurar Políticas do Bucket de Fotografia
1. Clique no bucket `photography`
2. Vá na aba **"Policies"**
3. Clique em **"New policy"** > **"For full customization"**
4. Cole a seguinte política para permitir leitura pública:

```sql
CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
USING (bucket_id = 'photography');
```

5. Clique em **"Review"** e depois **"Save policy"**

6. Crie outra política para upload (apenas autenticados):

```sql
CREATE POLICY "Permitir upload para usuários autenticados"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photography' AND auth.role() = 'authenticated');
```

### 3.3 Criar Bucket para Design
Repita o mesmo processo acima, mas com o nome `design`:

1. Crie o bucket **"design"** (público)
2. Adicione as mesmas políticas, substituindo `'photography'` por `'design'`

---

## 4. Obter Credenciais

### 4.1 Acessar Configurações da API
1. No menu lateral, clique no ícone de **engrenagem (⚙️)**
2. Clique em **"API"**

### 4.2 Copiar Credenciais
Você verá duas informações importantes:

1. **Project URL** - Algo como: `https://xxxxxxxxxxxxx.supabase.co`
2. **anon/public key** - Uma chave longa começando com `eyJ...`

> ⚠️ **Importante**: Copie a chave **anon** (não a service_role)

---

## 5. Configurar Aplicação

### 5.1 Criar Arquivo .env
1. Na raiz do projeto, crie o arquivo `.env` (se ainda não existir)
2. Adicione as credenciais copiadas:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Substitua** os valores pelos dados reais do seu projeto!

### 5.2 Verificar .gitignore
O arquivo `.gitignore` já está configurado para ignorar o `.env`, então suas credenciais não serão commitadas no Git.

---

## 6. Testar

### 6.1 Instalar Dependências (se necessário)
```bash
npm install
```

### 6.2 Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 6.3 Verificar Console do Browser
1. Abra o navegador em `http://localhost:5173`
2. Abra o DevTools (F12)
3. Verifique se não há erros relacionados ao Supabase

### 6.4 Testar com Dados de Exemplo

#### Adicionar Fotografia de Teste
1. No Supabase, vá em **"Table Editor"** > **"photography"**
2. Clique em **"Insert row"**
3. Preencha:
   - **title**: "Foto Teste"
   - **category**: "urban"
   - **url**: URL de uma imagem qualquer (ou use: `https://images.unsplash.com/photo-1516483638261-f4dbaf036963`)
   - **year**: 2024
4. Clique em **"Save"**

#### Adicionar Projeto de Design de Teste
1. Vá em **"Table Editor"** > **"design_projects"**
2. Clique em **"Insert row"**
3. Preencha:
   - **title**: "Projeto Teste"
   - **category**: "logos"
   - **description**: "Descrição do projeto"
   - **images**: `{"https://images.unsplash.com/photo-1626785774573-4b799315345d"}` (formato array)
   - **year**: 2024
4. Clique em **"Save"**

### 6.5 Verificar na Aplicação
1. Navegue até a página de Design Gráfico
2. Você deve ver o projeto de teste aparecer
3. Se aparecer, está tudo funcionando! 🎉

---

## 🔐 Configurar Autenticação (Opcional)

Se você quiser usar o sistema de login para adicionar/editar conteúdo:

### 6.6 Criar Usuário Admin
1. No Supabase, vá em **"Authentication"** > **"Users"**
2. Clique em **"Add user"** > **"Create new user"**
3. Preencha:
   - **Email**: seu email
   - **Password**: senha forte
   - **Auto Confirm User**: ✅ **Ativar**
4. Clique em **"Create user"**

Agora você pode fazer login na aplicação com esse email e senha!

---

## 🎯 Próximos Passos

Após configurar tudo:
1. ✅ Teste a aplicação localmente
2. ✅ Adicione seus projetos reais via Table Editor ou crie uma interface admin
3. ✅ Faça upload de suas imagens nos buckets de storage
4. ✅ Deploy da aplicação (Vercel, Netlify, etc.)

---

## ❓ Problemas Comuns

### Erro: "Invalid API key"
- Verifique se copiou a chave **anon** correta
- Verifique se o `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento

### Imagens não carregam
- Verifique se os buckets estão marcados como **públicos**
- Verifique se as políticas de leitura foram criadas corretamente

### Não consigo inserir dados
- Verifique se está logado (se as políticas exigem autenticação)
- Verifique as políticas RLS das tabelas

---

## 📚 Recursos Úteis

- [Documentação Oficial Supabase](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Feito com ❤️ para seu portfólio!**
