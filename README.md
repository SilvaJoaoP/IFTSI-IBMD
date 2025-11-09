# Gestão IBMD

Sistema de Gestão interno para a Igreja Batista Monte de Deus (IBMD).

## 🚀 Propósito

Esta é uma aplicação web para a administração interna da igreja, incluindo:

- Gestão de usuários (com cargos e permissões)
- Gestão de membros
- Futuramente: Gestão financeira, calendário de eventos e mídias.

## ✨ Funcionalidades Principais

- **Autenticação:** Sistema de login com `next-auth` (Auth.js).
- **Controle de Acesso (RBAC):** O dashboard e as funcionalidades são exibidos com base no cargo do usuário logado (`PASTOR`, `TESOUREIRO`, `DIACONO`, etc.).
- **Dashboard Central:** Um painel com blocos de acesso rápido às funcionalidades permitidas.
- **Gestão de Usuários:** O Pastor (administrador) pode Criar, Editar e Deletar contas de outros usuários.

## 🛠️ Stack de Tecnologias

- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** Postgres
- **Autenticação:** Next-Auth (Auth.js)
- **Estilização:** Tailwind CSS

---

## 🏃 Como Rodar (Desenvolvimento)

### 1. Pré-requisitos

- Node.js (v18+)
- NPM
- Um servidor PostgreSQL rodando

### 2. Configuração do Projeto

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-seu-repositorio>
    cd gestao-ibmd
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure o Ambiente:**

    - Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base).
    - Preencha `DATABASE_URL` e `AUTH_SECRET`.

    ```env
    # Exemplo de .env
    DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOMEDOBANCO"
    AUTH_SECRET="gere_um_secret_com_openssl_rand"
    ```

### 3. Configuração do Banco de Dados

1.  **"Empurre" o schema** para o seu banco de dados. Isso cria as tabelas.

    ```bash
    npx prisma db push
    ```

2.  **Gere o Prisma Client** (necessário após `npm install` ou mudanças no schema):
    ```bash
    npx prisma generate
    ```

### 4. Crie o Primeiro Usuário (Admin)

Para fazer o primeiro login, popule o banco com o usuário Pastor (administrador) usando o script de seed.

```bash
npx ts-node prisma/seed.ts
```
