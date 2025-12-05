# Setup Manual do Gerenciador de Páginas

## 🎯 Criar Collection no PocketBase (Manual)

Como o script automático requer ajustes, siga este guia para criar a collection manualmente:

### 1. Acessar PocketBase Admin

1. Abra: `http://127.0.0.1:8090/_/`
2. Faça login como admin

### 2. Criar Collection

1. Clique em **"Collections"** no menu lateral
2. Clique em **"+ New collection"**
3. Selecione **"Base collection"**
4. Nome: `page_visibility`

### 3. Adicionar Campos (Schema)

Adicione os seguintes campos clicando em **"+ New field"**:

#### Campo 1: page_key
- **Type**: Text
- **Name**: `page_key`
- **Required**: ✅ Sim
- **Unique**: ✅ Sim
- **Min length**: 1
- **Max length**: 50

#### Campo 2: page_name
- **Type**: Text
- **Name**: `page_name`
- **Required**: ✅ Sim
- **Min length**: 1
- **Max length**: 100

#### Campo 3: page_path
- **Type**: Text
- **Name**: `page_path`
- **Required**: ✅ Sim
- **Min length**: 1
- **Max length**: 200

#### Campo 4: is_active
- **Type**: Bool
- **Name**: `is_active`
- **Required**: ✅ Sim

#### Campo 5: order
- **Type**: Number
- **Name**: `order`
- **Required**: ✅ Sim

#### Campo 6: icon
- **Type**: Text
- **Name**: `icon`
- **Required**: ❌ Não
- **Max length**: 50

#### Campo 7: is_system
- **Type**: Bool
- **Name**: `is_system`
- **Required**: ✅ Sim

### 4. Configurar Permissões (API Rules)

Na aba **"API Rules"** da collection:

- **List/Search rule**: *(vazio - público)*
- **View rule**: *(vazio - público)*
- **Create rule**: `@request.auth.id != ""`
- **Update rule**: `@request.auth.id != ""`
- **Delete rule**: `@request.auth.id != ""`

Clique em **"Save collection"**

### 5. Adicionar Páginas (Records)

Clique em **"+ New record"** e adicione cada página:

#### 1. Home
```
page_key: home
page_name: Home
page_path: /
is_active: true
order: 1
icon: Home
is_system: true
```

#### 2. Fotografia
```
page_key: photography
page_name: Fotografia
page_path: /photography
is_active: true
order: 2
icon: Camera
is_system: false
```

#### 3. Design Gráfico
```
page_key: design
page_name: Design Gráfico
page_path: /design
is_active: true
order: 3
icon: Palette
is_system: false
```

#### 4. Sobre
```
page_key: about
page_name: Sobre
page_path: /about
is_active: true
order: 4
icon: User
is_system: false
```

#### 5. Serviços
```
page_key: services
page_name: Serviços
page_path: /services
is_active: true
order: 5
icon: Briefcase
is_system: false
```

#### 6. Bastidores
```
page_key: behind-the-scenes
page_name: Bastidores
page_path: /behind-the-scenes
is_active: true
order: 6
icon: Film
is_system: false
```

#### 7. Depoimentos
```
page_key: testimonials
page_name: Depoimentos
page_path: /testimonials
is_active: true
order: 7
icon: MessageSquare
is_system: false
```

#### 8. Busca Visual
```
page_key: visual-search
page_name: Busca Visual
page_path: /visual-search
is_active: true
order: 8
icon: Search
is_system: false
```

#### 9. Ranking
```
page_key: ranking
page_name: Ranking
page_path: /ranking
is_active: true
order: 9
icon: Trophy
is_system: false
```

#### 10. Contato
```
page_key: contact
page_name: Contato
page_path: /contact
is_active: true
order: 10
icon: Mail
is_system: true
```

---

## ✅ Verificar Setup

### 1. Verificar Collection
- Deve ter 10 records criados
- Todos com `is_active: true`
- Home e Contato com `is_system: true`

### 2. Testar API
Abra no navegador:
```
http://127.0.0.1:8090/api/collections/page_visibility/records
```

Deve retornar JSON com as 10 páginas.

### 3. Testar no Site

1. Abra: `http://localhost:8080`
2. O menu deve mostrar as 10 páginas
3. Acesse: `http://localhost:8080/admin/pages`
4. Deve ver o gerenciador funcionando

---

## 🎨 Testar Funcionalidades

### Toggle Ativo/Inativo
1. Desative "Busca Visual"
2. Menu deve atualizar (página some)
3. Reative
4. Página volta ao menu

### Reordenar
1. Arraste "Fotografia" para cima
2. Ordem do menu muda
3. Ordem salva automaticamente

### Páginas Sistema
1. Tente desativar "Home"
2. Deve ter ícone de cadeado 🔒
3. Não é possível desativar

---

## 🚀 Pronto!

Agora o Gerenciador de Páginas está configurado e funcionando!

**Próximo passo:** Fazer deploy para produção e configurar no VPS.
