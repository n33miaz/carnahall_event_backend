# CarnaHall Event API (Backend)

## Descrição

Este é o backend da aplicação CarnaHall Event, uma API RESTful construída com Fastify, TypeScript e Drizzle ORM. Ela é responsável por gerenciar a inscrição de usuários em um evento, controlar o ranking de indicações e fornecer dados para a interface web.

**interface web do projeto**: `https://carnahall-event-frontend.vercel.app/`

## Tecnologias Utilizadas

*   **Node.js:** Ambiente de execução JavaScript.
*   **Fastify:** Framework web para Node.js, conhecido por sua velocidade e baixo overhead.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
*   **Drizzle ORM:** ORM (Object-Relational Mapper) para interagir com o banco de dados PostgreSQL.
*   **PostgreSQL:** Banco de dados relacional usado para armazenar os dados da aplicação (hospedado no Neon).
*   **ioredis:** Cliente Redis para Node.js, usado para armazenar o ranking de indicações (hospedado no Upstash).
*   **Zod:** Biblioteca para validação de dados.
*   **Tsup:** Bundler para transpilar e otimizar o código TypeScript.
*   **Docker:** Plataforma para construir e executar aplicações em containers.
*   **Render:** Plataforma de cloud computing para hospedar a API.

## Pré-requisitos

*   Node.js (versão 20 ou superior)
*   npm (gerenciador de pacotes do Node.js)

## Configuração

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/carnahall_event_backend.git
    cd carnahall_event_backend
    ```

    *Substitua `https://github.com/seu-usuario/carnahall_event_backend.git` pela URL do seu repositório.*

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    *   Crie um arquivo chamado `.env` na raiz do projeto.
    *   Adicione as seguintes variáveis de ambiente e substitua os valores pelos seus:

        ```
        PORT=3333 # Pode ser qualquer porta disponível
        DATABASE_URL="<database>://<user>:<password>@<host>:<port>/<database>?sslmode=require"
        REDIS_URL="rediss://default:<password>@<host>:<port>"
        WEB_URL="<URL_DO_FRONTEND_NO_VERCEL>" #URL do front-end no Vercel (EX: https://carnahall-event-frontend.vercel.app/)
        ```

        *   **Importante:** Nunca compartilhe o arquivo `.env` com outras pessoas e não o adicione ao Git (ele já deve estar no `.gitignore`).

4.  **Execute as migrações do banco de dados:**

    ```bash
    npm run db:migrate
    ```

    *   Isso irá criar as tabelas no seu banco de dados PostgreSQL no Neon.