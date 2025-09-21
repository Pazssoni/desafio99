# Kortex - Personal Command Center

Kortex is a comprehensive full-stack application built to showcase modern web development capabilities. It features a secure, stateful authentication system and a dynamic, interactive user dashboard. This project was developed to evaluate code quality, architectural patterns, security best practices, and the ability to deliver a feature-rich, polished MVP.

## Key Features

* **Secure, Stateful Authentication:** A complete auth system with registration, login, and logout. Session persistence is managed statefully with **Redis**, leveraging short-lived JWT Access Tokens and secure, `httpOnly` Refresh Tokens.
* **Interactive Dashboard:** A protected, single-page application experience featuring:
    * **Quick Notes CRUD:** A full CRUD interface for personal note-taking.
    * **"Trainer's Challenge" Game:** An interactive "Who's That Pokémon?" widget powered by the PokeAPI.
    * **Info Hub Widgets:** Dynamically fetched data from external APIs, including mock weather data and a GitHub repository viewer.
* **Automated Testing & CI:** An integration test suite for the backend built with **Jest & Supertest**. A **GitHub Actions** workflow automatically runs all tests on every push to ensure code integrity.
* **Interactive API Documentation:** The backend API is fully documented using OpenAPI (Swagger), providing an interactive UI to explore and test the endpoints.
* **Fully Containerized Environment:** The entire application stack (Frontend, Backend, PostgreSQL, Redis) is containerized with **Docker** and orchestrated with **Docker Compose**. The startup process is fully automated.

## Tech Stack

| Category      | Technologies                                                               |
| :------------ | :------------------------------------------------------------------------- |
| **Backend** | Node.js, Express, PostgreSQL, Redis, Prisma (ORM), JWT, Zod, Bcrypt.js       |
| **Frontend** | React, Vite, Chakra UI, Axios, Framer Motion, React Icons                    |
| **Testing** | Jest, Supertest                                                            |
| **DevOps** | Docker, Docker Compose, Nginx, GitHub Actions, Makefile                    |

## Getting Started

**Prerequisites:**
* [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
* [GNU Make](https://community.chocolatey.org/packages/make) (for Makefile shortcuts)

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_FOLDER_NAME>
```

### 2. Run the Full Setup Command

This single command builds the Docker images, starts all services, waits for the database to be healthy, runs database migrations, and seeds the database with a test user.

```bash
make setup
```

### 3. Access the Application

* **Frontend Application:** [http://localhost:8080](http://localhost:8080)
* **API Documentation (Swagger):** [http://localhost:3333/api-docs](http://localhost:3333/api-docs)



## Useful Commands

All commands are run from the project root.

* `make up`: Builds and starts all containers.
* `make down`: Stops all containers.
* `make logs`: Tails the logs from all running services.
* `make test`: Runs the backend integration test suite.
* `make seed`: Seeds the development database with the test user.
* `make clean`: Stops all containers and **deletes all database volumes**.


## Project Journey & Learnings

This project was an incredible opportunity for learning and growth. The biggest challenge, without a doubt, was the transition from a local development setup to a fully containerized system with Docker. Finding and solving the communication issues between services, especially the CORS and networking hurdles, was a complex process but taught me a great deal about the importance of a robust environment configuration.

Another highlight was the chance to bring some creativity into the project. As a Pokémon fan, building the "Who's That Pokémon?" mini-game was a way to challenge myself to go beyond the requirements and have some fun in the process. Ultimately, the goal was to deliver not just a project that met the specifications, but one that also reflected my effort in learning and applying good practices, from automated testing to implementing security with Redis. It was a challenging but very rewarding experience.