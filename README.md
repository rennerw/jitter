# Jitter - API REST com Node.js e TypeScript

Uma API REST modular e bem estruturada construída com **Node.js**, **TypeScript**, **Prisma ORM** e **PostgreSQL**, seguindo princípios de **Clean Architecture** e **SOLID**.

## 📋 Visão Geral

O projeto demonstra uma arquitetura profissional para backend, separando responsabilidades em camadas:

- **Controllers**: Lidam com requisições HTTP
- **Services**: Contêm lógica de negócio
- **Repositories**: Acesso a dados (abstração do ORM)
- **Entities**: Modelos de domínio independentes do banco
- **DTOs**: Validação e transferência de dados
- **Routes**: Definição de endpoints

## 🏗️ Arquitetura

```
jitter/
├── core/                    # Infraestrutura do servidor
│   ├── controller.ts        # Interface base para controllers abstratos
│   ├── core.ts             # Classe principal do servidor
│   ├── database/           # Conexão e geração do Prisma
│   ├── http/               # HTTP handlers (router, request/response customizados)
│   ├── middleware/         # Middlewares (para expansão futura)
│   └── utils/              # Utilitários
│
├── api/                     # Lógica de negócio
│   ├── controllers/        # Controllers (handlers de requisição)
│   ├── services/          # Serviços (regras de negócio)
│   ├── repositories/      # Repositories (acesso a dados)
│   ├── entities/          # Entidades de domínio
│   ├── dto/               # Data Transfer Objects (validação)
│   ├── exceptions/        # Exceções customizadas
│   └── routes/            # Definição de rotas
│
├── prisma/                 # Configuração Prisma ORM
│   └── schema.prisma      # Schema do banco de dados
│
├── .env                    # Variáveis de ambiente
├── compose.yaml            # Configuração Docker Compose
├── tsconfig.json          # Configuração TypeScript
└── package.json           # Dependências do projeto
```

## 🚀 Setup Inicial

### Pré-requisitos

- Node.js v18+
- Docker & Docker Compose (opcional, para banco de dados)
- npm ou yarn

### 1. Instalação com Docker Compose (Recomendado)
## 1.1 Verifique o arquivo compose.yaml, altere portas, user e pass se necessario
```bash
# Clone o repositório (ou navegue até ele)
cd jitter

# Suba o banco de dados PostgreSQL e Adminer
docker-compose up -d

# Instale as dependências
npm install

# Configure a conexão com o banco
# Crie um arquivo .env na raiz do projeto:
DATABASE_URL="postgresql://root:toor@localhost:5432/jitter"

# Execute as migrations e gere o Prisma Client
npm run setup

# Inicie o servidor em desenvolvimento
npm run dev
```

**Verificar o banco de dados:**
- Acesse [http://localhost:8081](http://localhost:8081) (Adminer)
- Login: usuário `root`, senha `toor`, banco `postgres`

### 2. Instalação sem Docker

```bash
# Instale as dependências
npm install

# Configure manualmente um PostgreSQL local e crie um .env condizente com o user e senha do compose.yaml:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/jitter"

# Execute as migrations
npm run setup

# Inicie o servidor
npm run dev
```

## 📦 Dependências Principais

```json
{
  "@prisma/adapter-pg": "Adapter PostgreSQL para Prisma",
  "@prisma/client": "ORM para acesso ao banco de dados",
  "class-validator": "Validação de DTOs",
  "class-transformer": "Transformação de objetos",
  "dotenv": "Variáveis de ambiente",
  "pg": "Driver PostgreSQL",
  "ts-node-dev": "Desenvolvimento com hot reload"
}
```

## 🔧 Configuração do .env

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://root:toor@localhost:5432/teste"

# Opcional: Port do servidor
PORT=3000
```

## 📝 Scripts NPM

```bash
# Setup inicial (instala + migrations + gera Prisma)
npm run setup

# Desenvolvimento com hot reload
npm run dev

# Produção com compilação TypeScript
npm start

# Compilar TypeScript para dist/
npm run build  # (adicionar conforme necessário)
```

## 🗄️ Banco de Dados (Prisma)

### Schema (prisma/schema.prisma)

O projeto define duas entidades principais:

- **Order**: Pedidos com `id`, `value` (valor) e `creationDate`
- **Item**: Itens de pedido com `quantity`, `price`, `productId`

### Migrations

```bash
# Criar nova migration após alterar schema.prisma
npx prisma migrate dev --name seu_nome_descritivo

# Ver histórico de migrations
npx prisma migrate status

# Reset do banco (cuidado! apaga tudo)
npx prisma migrate reset
```

### Prisma Studio (Visual DB Browser)

```bash
# Abrir interface visual do Prisma
npx prisma studio
```

## 🎯 Fluxo de Requisição

```
1. Cliente faz requisição HTTP
   ↓
2. Router encontra a rota correspondente
   ↓
3. Handler customizado (customRequest) processa: body, query, pathParams
   ↓
4. Controller recebe a requisição
   ↓
5. Service aplica regras de negócio
   ↓
6. Repository acessa o banco via Prisma
   ↓
7. Dados retornam e são mapeados para Entity (domínio)
   ↓
8. ResponseHandler prepara resposta HTTP
   ↓
9. Resposta é enviada ao cliente
```

## 📡 Exemplo de Uso - Criar uma Order

### Rota POST `/api/order`

**Request:**
```json
{
  "numeroPedido": "ORD001-v1",
  "valorTotal": 150.50,
  "dataCriacao": "2025-03-09T10:00:00Z",
  "items": [
    {
      "idItem": 1,
      "valorItem": 50.00,
      "quantidadeItem": 2
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "code": 201,
  "message": "Ordem criada com sucesso",
  "data": {
    "orderId": "ORD001-v1",
    "value": 150.50,
    "creationDate": "2025-03-09T10:00:00Z",
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 50.00
      }
    ]
  }
}
```

## 🔐 Transações no Prisma

Para operações que envolvem múltiplos repositories (ex: criar pedido + itens), o projeto usa **transações**:

```typescript
const result = await prisma.$transaction(async (tx) => {
  const orderRepo = new OrderRepository(tx);
  const itemRepo = new ItemRepository(tx);

  // Ambas as operações ocorrem atomicamente
  const order = await orderRepo.criar(orderData);
  await itemRepo.criar(itemData);

  return order;
});
```

Se qualquer operação falhar, tudo é desfeito automaticamente. Assim garante-se a integridade

## 🛠️ Adicionando Novas Funcionalidades

### 1. Nova Entidade

```typescript
// 1. Define no schema.prisma
model User {
  id    String  @id @default(uuid())
  name  String
  email String  @unique
}

// 2. Crie user.entity.ts
export interface UserEntity {
  id: string;
  name: string;
  email: string;
}

// 3. Crie user.repository.ts com CRUD
// 4. Crie user.service.ts com lógica
// 5. Crie user.controller.ts como handler
// 6. Registre rotas em routes/user.ts
```

### 2. Middleware Customizado

```typescript
// core/middleware/auth.ts
export function authMiddleware(request, response) {
  // Validar token, etc
}

// Adicionar ao router
router.use(authMiddleware);
```

## 🐛 Troubleshooting

### "Cannot find module..."
- Certifique-se de que `tsconfig.json` tem `moduleResolution: "node"`
- Rode `npm run setup` para gerar o Prisma Client

### "ECONNREFUSED" ao conectar ao banco
- Verifique se o Docker está rodando: `docker-compose ps`
- Confira se o `.env` tem a URL correta
- Aguarde alguns segundos para o PostgreSQL iniciar

### Port 3000 já está em uso
- Mude a porta em `core/core.ts` (linha `listen(3000, ...)`)

## 📚 Recursos

- [Node.js Docs](https://nodejs.org)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Prisma Documentation](https://www.prisma.io)
- [PostgreSQL Docs](https://www.postgresql.org)
- [Docker Docs](https://docs.docker.com)

## 📄 Licença

Este é um projeto de estudo. Use livremente!

---

**Dúvidas?**
- [Zapzap-me](https://wa.me/5518981645265)