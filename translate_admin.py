#!/usr/bin/env python3
"""
Script para traduzir e melhorar o Admin.tsx
Faz traduções de textos visíveis sem alterar a estrutura do código
"""

import re
import sys

#Dicionário de traduções
TRANSLATIONS = {
    # Login
    "Admin Login": "Painel Administrativo",
    "Enter your credentials to manage the portfolio": "Gerencie seu portfólio de fotografia e design",
    "Email": "E-mail",
    "Password": "Senha",
    "Login": "Entrar",
    "Logging in...": "Entrando...",
    "Login Failed": "Falha no Login",
    "Success": "Sucesso",
    "Welcome to the admin panel!": "Bem-vindo ao painel administrativo!",
    "Logged Out": "Desconectado",
    "You have been logged out successfully.": "Você foi desconectado com sucesso.",
    "Logout": "Sair",
    
    # Header
    "Admin Panel": "Painel Administrativo",
    
    # Tabs
    "Photography": "Fotografia",
    "Design": "Design",
    "Hero": "Hero",
    "Content": "Conteúdo",
    
    # Photography Management
    "Photography Management": "Gerenciamento de Fotografias",
    "Batch Upload": "Upload em Lote",
    "Add New Photo": "Adicionar Nova Foto",
    "Upload New Photo": "Fazer Upload de Foto",
    "Edit Photo": "Editar Foto",
    "Image File": "Arquivo de Imagem",
    "Category": "Categoria",
    "Title": "Título",
    "Description": "Descrição",
    "Year": "Ano",
    "Event Name (optional)": "Nome do Evento (opcional)",
    "Event Date (optional)": "Data do Evento (opcional)",
    "Tags (optional)": "Tags (opcional)",
    "Upload Photo": "Fazer Upload",
    "Uploading...": "Enviando...",
    "Update Photo": "Atualizar Foto",
    "Updating...": "Atualizando...",
    "Cancel": "Cancelar",
    "Edit": "Editar",
    "Delete": "Deletar",
    "Photo uploaded successfully!": "Foto enviada com sucesso!",
    "Photo updated successfully!": "Foto atualizada com sucesso!",
    "Photo Deleted": "Foto Deletada",
    "The photo has been removed successfully.": "A foto foi removida com sucesso.",
    "Delete Failed": "Falha ao Deletar",
    "Error": "Erro",
    "Loading...": "Carregando...",
    "No photos yet. Add your first one above!": "Nenhuma foto ainda. Adicione a primeira acima!",
    
    # Design Management  
    "Design Projects Management": "Gerenciamento de Projetos",
    "Add New Project": "Adicionar Novo Projeto",
    "Upload New Design Project": "Fazer Upload de Projeto",
    "Images (multiple allowed)": "Imagens (múltiplas permitidas)",
    "Client (optional)": "Cliente (opcional)",
    "Upload Project": "Fazer Upload",
    "Design project uploaded successfully!": "Projeto enviado com sucesso!",
    "Project Deleted": "Projeto Deletado",
    "The project has been removed successfully.": "O projeto foi removido com sucesso.",
    "No projects yet. Add your first one above!": "Nenhum projeto ainda. Adicione o primeiro acima!",
    
    # Hero Management
    "Hero Images Management": "Gerenciamento de Imagens Hero",
    "Add New Hero Image": "Adicionar Nova Imagem Hero",
    "Upload New Hero Image": "Fazer Upload de Imagem Hero",
    "Title (for reference)": "Título (para referência)",
    "Upload Image": "Fazer Upload",
    "Set Active": "Ativar",
    "Deactivate": "Desativar",
    "Hero image uploaded successfully!": "Imagem hero enviada com sucesso!",
    "Image Deleted": "Imagem Deletada",
    "The hero image has been removed successfully.": "A imagem hero foi removida com sucesso.",
    "No hero images yet. Add your first one above!": "Nenhuma imagem hero ainda. Adicione a primeira acima!",
    "ACTIVE": "ATIVA",
    
    # Content Management
    "Site Content Management": "Gerenciamento de Conteúdo do Site",
    "Search content...": "Buscar conteúdo...",
    "Loading content...": "Carregando conteúdo...",
    "items": "itens",
    "Save": "Salvar",
    "Content updated successfully!": "Conteúdo atualizado com sucesso!",
}

def translate_file(input_path, output_path):
    """Lê o arquivo, faz as traduções e salva"""
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fazer as traduções
    for english, portuguese in TRANSLATIONS.items():
        # Usar regex para encontrar o texto entre aspas/tags
        # Cuidado para não substituir em comentários ou nomes de variáveis
        
        # Padrão 1: Entre aspas simples
        content = re.sub(
            rf"'({re.escape(english)})'",
            f"'{portuguese}'",
            content
        )
        
        # Padrão 2: Entre aspas duplas  
        content = re.sub(
            rf'"({re.escape(english)})"',
            f'"{portuguese}"',
            content
        )
        
        # Padrão 3: Entre tags JSX (para textos diretos)
        content = re.sub(
            rf">({re.escape(english)})<",
            f">{portuguese}<",
            content
        )
    
    # Salvar arquivo traduzido
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Arquivo traduzido salvo em: {output_path}")
    return True

if __name__ == "__main__":
    input_file = sys.argv[1] if len(sys.argv) > 1 else "src/pages/Admin.tsx"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "src/pages/Admin_translated.tsx"
    
    translate_file(input_file, output_file)
