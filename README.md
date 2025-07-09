# NLW AGENTS 🚀

Este projeto foi desenvolvido durante o evento **NLW** da Rocketseat.

## 📋 Descrição

O **NLW AGENTS** é um servidor backend construído com Node.js, Fastify e Drizzle ORM, utilizando PostgreSQL como banco de dados. O objetivo principal é gerenciar salas (rooms) e fornecer uma API simples para consulta.

## 🛠️ Tecnologias e Bibliotecas Utilizadas

- **Node.js** e **TypeScript** — Ambiente de execução e tipagem estática
- **Fastify** — Framework web para Node.js, focado em performance
- **@fastify/cors** — Middleware para habilitar CORS
- **Zod** e **fastify-type-provider-zod** — Validação de dados e schemas
- **Drizzle ORM** e **drizzle-kit** — ORM para integração com bancos SQL
- **drizzle-seed** — Geração de dados fake para popular o banco
- **PostgreSQL** (com extensão pgvector) — Banco de dados relacional
- **biome** — Linter e formatador de código
- **ultracite** — Configuração de estilo de código

## ⚙️ Como rodar o projeto

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install
   ```

2. **Suba o banco de dados com Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```env
   PORT=3333
   DATABASE_URL=postgresql://docker:docker@localhost:5432/agents
   ```

4. **Rode as migrações e o seed:**
   ```bash
   # (Opcional) Gere as migrations com o drizzle-kit, se necessário
   npx drizzle-kit generate:pg

   # Rode o seed para popular o banco
   npm run db:seed
   ```

5. **Inicie o servidor em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📡 Endpoints principais

- `GET /health` — Health check
  - **Resposta:**
    ```json
    "ok"
    ```

- `GET /rooms` — Lista todas as salas
  - **Resposta:**
    ```json
    [
      {
        "id": "uuid",
        "name": "Nome da sala"
      }
    ]
    ```

Exemplo de uso pode ser encontrado no arquivo `client.http`.

## 📝 Observações

- O projeto utiliza o **Drizzle ORM** para manipulação do banco de dados e geração de migrations.
- O seed gera 20 salas fictícias automaticamente.
- O banco de dados é inicializado com a extensão **pgvector** (veja `docker/setup.sql`).
- O código segue o padrão de formatação definido pelo **biome** e **ultracite**.

---

Feito com 💜 durante o NLW da Rocketseat! 