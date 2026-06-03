# ♻️ ReUse!

**ReUse!** é uma plataforma de troca de roupas, sapatos e acessórios. Dê uma nova vida às suas peças e encontre o que você procura sem gastar nada. Sustentabilidade e estilo em um só lugar.

---

## 🚀 Tecnologias

- **[Next.js 15](https://nextjs.org/)** — Framework React com App Router e Turbopack
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática
- **[Prisma](https://www.prisma.io/)** — ORM para banco de dados PostgreSQL
- **[Better Auth](https://better-auth.com/)** — Autenticação com suporte a sessões
- **[Uploadthing](https://uploadthing.com/)** — Upload de imagens
- **[shadcn/ui](https://ui.shadcn.com/)** — Componentes de UI acessíveis
- **[Tailwind CSS](https://tailwindcss.com/)** — Estilização utilitária
- **[Zod](https://zod.dev/)** — Validação de schemas
- **[React Hook Form](https://react-hook-form.com/)** — Gerenciamento de formulários
- **[Leaflet](https://leafletjs.com/)** + **[Nominatim](https://nominatim.org/)** — Mapa interativo com geocoding gratuito
- **[Sonner](https://sonner.emilkowal.ski/)** — Notificações toast

---

## ✨ Funcionalidades

- Cadastro e login de usuários
- Recuperação de senha (em desenvolvimento)
- Publicação de produtos com até 5 imagens
- Edição e exclusão de publicações (com remoção automática das imagens no Uploadthing)
- Feed de produtos com filtro por categoria (Roupas, Sapatos, Acessórios)
- Página de detalhes do produto com galeria de imagens e informações do vendedor
- Mapa interativo com produtos próximos ao usuário logado (filtro por raio em km)
- Perfil do usuário com histórico de publicações
- Busca de produtos
- Biografia do usuário no perfil

---

## 📁 Estrutura do Projeto

```
reuse-1/
├── actions/
│   ├── products.ts             # CRUD de produtos (criar, editar, excluir, buscar)
│   └── profile.ts              # Ações de perfil e localização
│
├── app/
│   ├── (private)/              # Rotas autenticadas (requerem login)
│   │   ├── feed/
│   │   │   └── page.tsx        # Feed de produtos com filtro por categoria
│   │   ├── inicio/
│   │   │   └── page.tsx        # Página inicial com mapa de produtos próximos
│   │   ├── perfil/
│   │   │   └── page.tsx        # Perfil do usuário com publicações
│   │   └── produtos/
│   │       └── [id]/
│   │           └── page.tsx    # Página de detalhes do produto
│   │
│   ├── (public)/               # Rotas públicas (sem autenticação)
│   │   ├── cadastre-se/
│   │   │   └── page.tsx        # Página de cadastro
│   │   └── esqueceu-a-senha/
│   │       └── page.tsx        # Recuperação de senha
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts    # Rotas dinâmicas do Better Auth
│   │   └── uploadthing/
│   │       ├── core.ts         # Configuração e regras de upload
│   │       └── route.ts        # Rota da API do Uploadthing
│   │
│   ├── globals.css             # Estilos globais e variáveis de tema
│   ├── layout.tsx              # Layout raiz da aplicação
│   ├── not-found.tsx           # Página 404
│   └── favicon.ico
│
├── components/
│   ├── layout/                 # Componentes de layout reutilizáveis
│   │   ├── biografiaField.tsx      # Campo de biografia do perfil
│   │   ├── buscarForm.tsx          # Formulário de busca de produtos
│   │   ├── carrosselField.tsx      # Carrossel de produtos no perfil
│   │   ├── excluirProduto.tsx      # Botão de exclusão com confirmação
│   │   ├── localizacaoPopUp.tsx    # PopUp para configurar localização
│   │   ├── mapaPopUp.tsx           # PopUp do mapa interativo
│   │   ├── mapaProduto.tsx         # Componente Leaflet do mapa
│   │   ├── publicacaoPopUp.tsx     # PopUp para criar e editar publicações
│   │   ├── selectField.tsx         # Campo select reutilizável
│   │   └── sidebar.tsx             # Sidebar de navegação
│   │
│   └── ui/                     # Componentes shadcn/ui customizados
│
├── features/                   # Funcionalidades de autenticação
│   ├── forgetPassword/         # Fluxo de recuperação de senha
│   ├── login/                  # Formulário de login
│   └── register/               # Formulário de cadastro
│
├── hooks/
│   └── useGeocoding.ts         # Hook de geocoding com fórmula Haversine
│
├── lib/
│   ├── auth-client.ts          # Cliente do Better Auth
│   ├── auth.ts                 # Configuração do Better Auth
│   ├── middleware.ts           # Middleware de autenticação de rotas
│   ├── prisma.ts               # Cliente Prisma singleton
│   ├── uploadthing.ts          # Helper do Uploadthing
│   └── utils.ts                # Utilitários gerais
│
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
│
├── public/                     # Arquivos estáticos
├── package.json
└── tsconfig.json
```

---

## 🛠️ Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no [Uploadthing](https://uploadthing.com/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/abner-ferreira/reuse.git
cd reuse-1

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### Variáveis de ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@host:5432/reuse?sslmode=verify-full"

# Better Auth
BETTER_AUTH_SECRET="sua_secret_key"
BETTER_AUTH_URL="http://localhost:3000"

# Uploadthing
UPLOADTHING_TOKEN="sua_token"
```

### Banco de dados

```bash
# Rode as migrations
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate
```

### Rodando o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 🗃️ Schema do Banco de Dados

```prisma
model Product {
  id                  String   @id @default(cuid())
  name                String
  description         String
  category            String
  stateOfConservation String
  images              String[]
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  authorId            String
  author              User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([authorId])
}

model User {
  id       String    @id
  name     String
  email    String
  image    String?
  city     String?
  state    String?
  country  String?
  products Product[]
}
```

---

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Roda o ESLint |
| `npx prisma studio` | Abre o Prisma Studio |
| `npx prisma migrate dev` | Roda as migrations |
| `npx prisma generate` | Gera o cliente Prisma |

---

## 🗺️ Rotas da Aplicação

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Página de login |
| `/cadastre-se` | Público | Cadastro de novo usuário |
| `/esqueceu-a-senha` | Público | Recuperação de senha |
| `/inicio` | Privado | Página inicial com mapa |
| `/feed` | Privado | Feed de produtos |
| `/perfil` | Privado | Perfil do usuário |
| `/produtos/[id]` | Privado | Detalhes de um produto |

---

## 🌱 Roadmap

- [ ] Sistema de chat entre usuários para negociação
- [ ] Notificações em tempo real
- [ ] Avaliação de usuários após troca
- [ ] Histórico de trocas realizadas

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na **FIAP**.