# UniDraft - Plataforma de Recrutamento Universitário

Uma aplicação web moderna para conectar recrutadores com talentos universitários, desenvolvida com Next.js 15, TypeScript e Tailwind CSS.

## 🎯 Funcionalidades

### 📱 Páginas Implementadas

1. **Página de Login** (`/login`)
   - Design moderno e responsivo
   - Campos com ícones (email e senha)
   - Logo da empresa e mensagem de boas-vindas
   - Botão de acesso principal
   - Link para cadastro de recrutador

2. **Página de Cadastro de Recrutador** (`/cadastro-recrutador`)
   - Formulário completo baseado no modelo JSON
   - Campos: Nome, Email, Senha, Cargo, Telefone
   - Validação de formulário
   - ID da empresa pré-configurado
   - Navegação de volta para login

3. **Dashboard do Recrutador** (`/dashboard`)
   - Menu lateral (sidebar) responsivo
   - Cards com estatísticas agregadas
   - Lista de alunos com perfis detalhados
   - Visualização de aptidões com níveis (1-5 estrelas)
   - Links para redes sociais (LinkedIn, GitHub, Portfolio)
   - Distribuição por semestre
   - Ranking de aptidões populares

4. **Página de Alunos** (`/alunos`)
   - Listagem completa dos alunos
   - Sistema de busca e filtros
   - Estatísticas em tempo real
   - Cards expandidos com informações de contato
   - Funcionalidades de exportação

### 🎨 Design

- **Paleta de Cores**: Azul principal (#2563eb), tons de cinza neutros
- **Tipografia**: Geist Sans (moderna e legível)
- **Componentes**: Cards com bordas arredondadas e sombras suaves
- **Responsividade**: Totalmente adaptável para mobile, tablet e desktop
- **Ícones**: Lucide React para ícones modernos e consistentes

### 🏗️ Tecnologias Utilizadas

- **Frontend**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: Shadcn/ui (Radix UI)
- **Ícones**: Lucide React
- **Notificações**: Sonner

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd facul-ui
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📊 Estrutura de Dados

### Recrutador (JSON)
```json
{
  "nome": "Juliana Nunes",
  "email": "julianarecrutadora@gmail.com",
  "senha": "12345678",
  "cargo": "Recrutadora Senior",
  "telefone": "81979143530",
  "id_empresa": "6be81cfe-3aa2-4028-b872-c480be3af922"
}
```

### Aluno (JSON)
```json
{
  "nome": "João Silva",
  "curso": "Ciência da Computação",
  "semestre_atual": 4,
  "solicitacoes": 1,
  "aptidoes": [
    { "nome": "JavaScript", "nivel": 5 },
    { "nome": "Python", "nivel": 4 },
    { "nome": "SQL", "nivel": 3 }
  ]
}
```

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── cadastro-recrutador/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── alunos/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── Sidebar.tsx
└── actions/
    └── authetication.ts
```

## 🎯 Funcionalidades Futuras

- [ ] Integração com API real
- [ ] Autenticação JWT
- [ ] Filtros avançados de busca
- [ ] Sistema de mensagens entre recrutadores e alunos
- [ ] Notificações em tempo real
- [ ] Exportação de dados em PDF/Excel
- [ ] Dashboard com gráficos interativos
- [ ] Sistema de match automático

## 📱 Responsividade

A aplicação foi desenvolvida com foco em responsividade:
- **Mobile**: Interface otimizada para dispositivos móveis
- **Tablet**: Layout adaptável para tablets
- **Desktop**: Experiência completa em telas grandes

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa verificação de código

## 📝 Licença

Este projeto é privado e desenvolvido para fins acadêmicos.
