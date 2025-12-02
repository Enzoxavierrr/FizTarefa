# 📋 FizTarefa

Uma aplicação moderna de gerenciamento de tarefas e produtividade, construída com React, TypeScript e Supabase.

![FizTarefa Dashboard](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-cyan)

## ✨ Funcionalidades

- 🎯 **Gerenciamento de Tarefas** - Crie, organize e acompanhe suas tarefas
- ⏱️ **Timer Pomodoro** - Mantenha o foco com sessões de 25 minutos
- 📊 **Dashboard de Estatísticas** - Visualize seu progresso com gráficos interativos
- 📅 **Calendário Integrado** - Organize suas tarefas por data
- 🔐 **Autenticação Segura** - Login e registro com Supabase Auth
- 🌙 **Tema Escuro/Claro** - Interface adaptável às suas preferências
- ✨ **Animações Suaves** - UI moderna com Framer Motion

## 🛠️ Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utilitária
- **Framer Motion** - Animações fluidas
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones modernos
- **Radix UI** - Componentes acessíveis
- **Magic UI** - Componentes especiais (Smooth Cursor, Dot Pattern)

### Backend & Infraestrutura
- **Supabase** - Backend as a Service (Auth, Database, Real-time)
- **Zustand** - Gerenciamento de estado
- **React Router DOM** - Navegação SPA

### Ferramentas de Desenvolvimento
- **Vite** - Build tool ultrarrápido
- **ESLint** - Linting de código
- **React Grab** - Ferramenta de desenvolvimento para AI

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun
- Conta no [Supabase](https://supabase.com)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/fiztarefa.git
cd fiztarefa
```

2. **Instale as dependências**
```bash
npm install

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticação
│   ├── dashboard/     # Componentes do dashboard
│   ├── layout/        # Layout e navegação
│   ├── pomodoro/      # Timer Pomodoro
│   ├── tasks/         # Gerenciamento de tarefas
│   └── ui/            # Componentes UI reutilizáveis
├── hooks/             # Custom hooks
├── lib/               # Configurações e utilitários
├── pages/             # Páginas da aplicação
├── stores/            # Estado global (Zustand)
└── types/             # Definições de tipos TypeScript
```

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Visualiza o build de produção |
| `npm run lint` | Executa o linter |

## 🎨 Design System

O projeto utiliza um sistema de design consistente com:

- **Cores** - Paleta monocromática com acentos em amarelo/dourado
- **Tipografia** - DM Sans como fonte principal
- **Componentes** - Baseados em Radix UI e ShadCN
- **Animações** - Transições suaves com Framer Motion

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com 💛 por [Enzo Xavier](https://github.com/seu-usuario)
