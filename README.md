# Kortex - Personal Command Center

##  About the Project

Kortex is a full-stack application developed as a skills assessment test. The goal was to build a "Personal Command Center" — a secure and interactive dashboard for managing personal notes and viewing information from external APIs.

The project was built with a focus on modern development practices, including a 100% containerized environment with Docker, a robust backend architecture (Model-Service-Controller), secure authentication using JWT and Redis, and a Continuous Integration (CI) pipeline with automated tests.

##  Key Features

* **Secure Authentication:** Registration and Login with JWT (Access Tokens) and Refresh Tokens managed via Redis.
* **Interactive Dashboard:** A single page that aggregates several widgets:
    * **Notes:** Full CRUD (Create, Read, Delete) functionality for personal notes.
    * **GitHub Repos:** Displays the last 5 public repositories of a GitHub user.
    * **Who's That Pokémon?:** An interactive mini-game that consumes the PokeAPI.
    * **Weather:** A simple widget with mock weather data.
* **Documented API:** The backend API is documented using Swagger/OpenAPI.

##  Tech Stack & Architectural Decisions

The choice of technologies was focused on creating a modern, secure, and scalable application.

#### **Backend**
* **Node.js with Express:** A robust and widely used environment for building RESTful APIs.
* **Prisma:** A modern ORM that ensures safety against SQL Injection and simplifies database migrations.
* **PostgreSQL:** A powerful and reliable relational database.
* **Redis:** Used for stateful session management (Refresh Tokens), allowing sessions to be instantly invalidated—a more secure architecture than pure JWTs.
* **Zod:** For schema validation, ensuring the integrity of data entering the API.
* **Model-Service-Controller (MSC) Architecture:** The code was structured to separate concerns, making it cleaner, more maintainable, and scalable.

#### **Frontend**
* **React with Vite:** A modern framework for building fast and reactive user interfaces.
* **Chakra UI:** A component library that speeds up development and ensures a consistent, accessible, and professionally designed UI.
* **Axios:** For making HTTP requests to the backend API in a centralized and organized way.
* **React Router:** For managing client-side routing.

#### **DevOps**
* **Docker & Docker Compose:** The application is 100% containerized, ensuring a consistent and easy-to-set-up development environment with a single command.
* **Makefile:** Simplifies complex Docker commands into easy-to-use shortcuts (e.g., `make setup`).
* **GitHub Actions (CI):** A Continuous Integration pipeline was configured to run automated tests on every `push`, ensuring code quality and stability.
* **Local HTTPS with `mkcert`:** The development environment runs on HTTPS, simulating a real production environment and following security best practices.

##  Setup and Execution

### Prerequisites
* **Docker** and **Docker Compose**
* **Make** (On Windows, can be installed with `choco install make`)
* **mkcert** (On Windows, can be installed with `choco install mkcert`)

### Installation Steps
1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd a
    ```

2.  **Generate Local SSL Certificates (First time only):**
    ```bash
    # Install the local Certificate Authority (may require admin privileges)
    mkcert -install

    # Create the certs folder and the certificates for the project
    mkdir .certs
    mkcert -key-file ./.certs/key.pem -cert-file ./.certs/cert.pem localhost 127.0.0.1 ::1
    ```

3.  **Run the Full Setup Command:**
    This single command will build the Docker images, start all services, apply database migrations, and seed the database with a test user.
    ```bash
    make setup
    ```

4.  **Access the Application:**
    * **Frontend Application:** **[https://localhost](https://localhost)** (Your browser may show a security warning the first time. You can safely accept it.)
    * **API Documentation (Swagger):** **http://localhost:3333/api-docs**

    **Test User:**
    * **Email:** `test@example.com`
    * **Password:** `password123`

##  Useful `Makefile` Commands

* `make up`: Builds and starts all containers.
* `make down`: Stops all containers.
* `make clean`: Stops everything and removes all volumes (deletes database data).
* `make logs`: Shows the real-time logs from all containers.
* `make test`: Runs the automated backend test suite.

##  Troubleshooting

### Port Conflicts
If you see an error like `port is already allocated` when running `make setup`, it means another service on your machine is using one of the required ports (80, 443, 3333, 5432, 5433, 6379).

**Solution:** Stop the conflicting service on your machine or change the corresponding port mapping in the `docker-compose.yml` file.

# Kortex - Centro de Comando Pessoal

##  Sobre o Projeto

O Kortex é uma aplicação full-stack desenvolvida como um teste de competências. O objetivo foi construir um "Centro de Comando Pessoal" — um dashboard seguro e interativo para gerir notas pessoais e visualizar informações de APIs externas.

O projeto foi construído com foco em práticas de desenvolvimento modernas, incluindo um ambiente 100% containerizado com Docker, uma arquitetura de backend robusta (Model-Service-Controller), autenticação segura com JWT e Redis, e um pipeline de Integração Contínua (CI) com testes automatizados.

##  Funcionalidades Principais

* **Autenticação Segura:** Registo e Login com JWT (Access Tokens) e Refresh Tokens geridos via Redis.
* **Dashboard Interativo:** Uma única página que agrega vários widgets:
    * **Notas:** Funcionalidade completa de CRUD (Criar, Ler, Apagar) para notas pessoais.
    * **GitHub Repos:** Visualiza os últimos 5 repositórios públicos de um utilizador do GitHub.
    * **Who's That Pokémon?:** Um mini-jogo interativo que consome a PokeAPI.
    * **Weather:** Um widget simples com dados meteorológicos (mock).
* **API Documentada:** A API do backend é documentada com Swagger/OpenAPI.

##  Stack Tecnológica & Decisões de Arquitetura

A escolha das tecnologias foi focada em criar uma aplicação moderna, segura и escalável.

#### **Backend**
* **Node.js com Express:** Um ambiente robusto e amplamente utilizado para a construção de APIs RESTful.
* **Prisma:** Um ORM moderno que garante segurança contra SQL Injection e facilita a gestão das migrações da base de dados.
* **PostgreSQL:** Uma base de dados relacional poderosa e confiável.
* **Redis:** Utilizado para a gestão de sessões (Refresh Tokens), permitindo invalidar sessões de forma instantânea, uma arquitetura mais segura do que JWTs puros.
* **Zod:** Para validação de schemas, garantindo a integridade dos dados que entram na API.
* **Arquitetura Model-Service-Controller (MSC):** O código foi estruturado para separar responsabilidades, tornando-o mais limpo, manutenível e escalável.

#### **Frontend**
* **React com Vite:** Uma framework moderna para a construção de interfaces de utilizador rápidas e reativas.
* **Chakra UI:** Uma biblioteca de componentes que acelera o desenvolvimento e garante uma UI consistente, acessível e com um design profissional.
* **Axios:** Para fazer pedidos HTTP à API do backend de forma centralizada e organizada.
* **React Router:** Para a gestão de rotas do lado do cliente (client-side routing).

#### **DevOps**
* **Docker & Docker Compose:** A aplicação é 100% containerizada, garantindo um ambiente de desenvolvimento consistente e fácil de configurar com um único comando.
* **Makefile:** Simplifica os comandos complexos do Docker em atalhos fáceis de usar (ex: `make setup`).
* **GitHub Actions (CI):** Um pipeline de Integração Contínua foi configurado para executar os testes automatizados a cada `push`, garantindo a qualidade e a estabilidade do código.
* **HTTPS Local com `mkcert`:** O ambiente de desenvolvimento roda em HTTPS, simulando um ambiente de produção real e seguindo as melhores práticas de segurança.

##  Configuração e Execução

### Pré-requisitos
* **Docker** e **Docker Compose**
* **Make** (No Windows, pode ser instalado com `choco install make`)
* **mkcert** (No Windows, pode ser instalado com `choco install mkcert`)

### Passos para a Instalação
1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITÓRIO]
    cd a
    ```

2.  **Gere os Certificados SSL Locais (Apenas na Primeira Vez):**
    ```bash
    # Instala a autoridade de certificação local (pode pedir permissão de administrador)
    mkcert -install

    # Cria a pasta e os certificados para o projeto
    mkdir .certs
    mkcert -key-file ./.certs/key.pem -cert-file ./.certs/cert.pem localhost 127.0.0.1 ::1
    ```

3.  **Execute o Comando de Setup Completo:**
    Este comando único irá construir as imagens Docker, iniciar todos os serviços, aplicar as migrações da base de dados e criar um utilizador de teste.
    ```bash
    make setup
    ```

4.  **Aceda à Aplicação:**
    * **Aplicação Frontend:** **[https://localhost](https://localhost)** (O seu navegador pode mostrar um aviso de segurança na primeira vez. Pode aceitá-lo com segurança.)
    * **Documentação da API (Swagger):** **http://localhost:3333/api-docs**

    **Utilizador de Teste:**
    * **Email:** `test@example.com`
    * **Password:** `password123`

##  Comandos Úteis com `Makefile`

* `make up`: Constrói e inicia todos os containers.
* `make down`: Para todos os containers.
* `make clean`: Para tudo e remove os volumes (apaga os dados das bases de dados).
* `make logs`: Mostra os logs de todos os containers em tempo real.
* `make test`: Executa a suíte de testes automatizados do backend.

##  Troubleshooting

### Conflito de Portas
Se vir um erro como `port is already allocated` ao executar `make setup`, significa que outro serviço na sua máquina está a usar uma das portas necessárias (80, 443, 3333, 5432, 5433, 6379).

**Solução:** Pare o serviço conflitante ou altere a porta correspondente no ficheiro `docker-compose.yml`.