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

This project was a journey from a set of requirements to a fully-fledged, robust application. The initial focus was on establishing a solid architectural foundation: a secure Node.js backend communicating with a responsive React frontend.

The first significant challenge arose when orchestrating the services with Docker. Debugging the intricate network between the browser, the frontend container, and the backend container was a profound learning experience, particularly in understanding CORS policies and the importance of the `localhost` context for browser-based API calls. Each `500 Internal Server Error` or `CORS policy` block became a lesson in systematic, log-driven debugging.

A key turning point was the decision to go beyond the basic requirements for the Pokémon widget. As a fan of the franchise, I saw an opportunity to demonstrate creativity by building the "Trainer's Challenge" game. This not only made the project more engaging but also required a deeper dive into React's state management and the use of CSS for dynamic styling, such as creating the Pokémon silhouette effect.

Implementing the bonus features elevated the project from a simple MVP to a professional-grade system. Setting up a full integration test suite with Jest/Supertest provided a safety net that made subsequent refactoring fearless. This foundation enabled the smooth implementation of a CI pipeline with GitHub Actions, automating quality assurance. The decision to then tackle stateful authentication with Redis was the most complex challenge, forcing a deeper understanding of session management and enhancing the application's security architecture significantly.

Finally, the visual redesign with Chakra UI was a rewarding final phase, demonstrating how a powerful component library can rapidly transform a functional prototype into a polished, modern, and aesthetically pleasing product. The result is not just an application that meets all technical specifications, but a testament to a development process that embraced challenges, prioritized robust architecture, and valued a creative and engaging user experience.