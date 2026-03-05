# Pridia

Pridia is a tool that helps product teams transform ideas into structured **Product Requirement Documents (PRDs)**.

The system guides users through a discovery workflow and generates structured documentation that can be used as a starting point for product development.

## Features

Pridia assists product teams by generating:

- Product overview
- Core features
- User stories
- Initial domain suggestions

The goal is not to replace product teams, but to **act as an intelligent assistant** that helps structure early product ideas.

---

# Workflow

The typical workflow inside Pridia is:

1. Create a project
2. Describe the product idea
3. Answer discovery questions
4. Generate a structured PRD
5. Generate user stories

Simplified flow:

Idea
↓
Discovery Questions
↓
PRD Generation
↓
User Stories

---

# Architecture

Pridia follows a layered backend architecture.

Client
↓
Backend API (Node + Express)
↓
Use Cases
↓
Repositories
↓
PostgreSQL

The AI layer is powered by **local LLMs using Ollama**, allowing the system to run without external API dependencies.

---

# Tech Stack

## Frontend

- Vue 3
- TypeScript

## Backend

- Node.js
- Express
- PostgreSQL
- pg (database driver)

## Infrastructure

- Docker
- Docker Compose

## AI

- Ollama (local LLM models)

---

# Project Structure

```
pridia
│
├── backend
│   ├── src
│   │   ├── domain
│   │   ├── application
│   │   ├── infrastructure
│   │   └── interfaces
│
├── frontend
│
├── docs
│
└── docker-compose.yml
```

The backend follows a layered architecture separating:

- **Domain** → business entities and contracts
- **Application** → use cases
- **Infrastructure** → database and external integrations
- **Interfaces** → HTTP controllers and routes

---

# Running the project locally

## 1. Clone the repository

```
git clone https://github.com/your-user/pridia
cd pridia
```

---

## 2. Start infrastructure

Run Docker Compose to start PostgreSQL and Ollama.

```
docker compose up
```

This will start:

- PostgreSQL database
- Ollama for local AI models

---

## 3. Run the backend

```
cd backend
npm install
npm run dev
```

The API will be available at:

```
http://localhost:3000
```

---

# Example API Request

Create a project:

POST /projects

Request body:

```
{
  "name": "Pridia",
  "idea": "AI assistant that generates PRDs"
}
```

---

# Roadmap

Planned features for the project:

- [x] Project creation
- [ ] Discovery questions
- [ ] PRD generation
- [ ] User stories generation
- [ ] Frontend interface
- [ ] Collaboration features

---

# About

Pridia is being developed as a portfolio project focused on:

- AI-assisted product documentation
- Backend architecture
- Local AI model integration
- Docker-based development environments
