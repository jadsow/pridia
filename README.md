# Pridia

Pridia is an AI-assisted tool that helps product teams transform ideas into structured **Product Requirement Documents (PRDs)**.

The system guides users through a discovery workflow and generates structured documentation that can be used as the foundation for product development.

Unlike traditional tools, Pridia runs **entirely with local AI models using Ollama**, meaning no external AI APIs are required.

---

# Features

Pridia assists product teams by generating:

- Product overview
- Problem statements
- Target users
- Core features
- Success metrics

The goal is not to replace product teams, but to **act as an intelligent assistant that helps structure early product ideas**.

---

# Workflow

The typical workflow inside Pridia is:

1. Create a project
2. Describe the product idea
3. Answer discovery questions
4. Generate a structured PRD using AI

Simplified flow:

```
Idea
↓
Discovery Questions
↓
PRD Generation
```

The generated PRD can then be used as a starting point for:

- product planning
- feature breakdown
- user story generation

---

# Architecture

Pridia follows a layered architecture inspired by **Clean Architecture principles**.

```
Client
↓
HTTP Controllers
↓
Use Cases
↓
Domain
↓
Repositories
↓
Infrastructure
```

This separation ensures that:

- business logic is independent from frameworks
- infrastructure can be replaced easily
- the system remains maintainable as it grows

---

# Tech Stack

## Frontend

- Vue 3
- TypeScript
- (planned) Vuetify

## Backend

- Node.js
- Express
- PostgreSQL
- pg

## Infrastructure

- Docker
- Docker Compose

## AI

- Ollama
- Local LLM models (Llama3)

---

# Project Structure

```
pridia
│
├── backend
│   ├── src
│   │   ├── domain
│   │   ├── application
│   │   ├── infra
│   │   └── interfaces
│
├── frontend
│
├── docs
│
└── docker-compose.yml
```

Backend layers:

| Layer          | Responsibility                   |
| -------------- | -------------------------------- |
| Domain         | Business entities and interfaces |
| Application    | Use cases                        |
| Infrastructure | Database and external services   |
| Interfaces     | HTTP controllers and routes      |

---

# Running the project locally

Pridia is designed so anyone can run the entire environment with **Docker**.

## Prerequisites

Before running the project, make sure you have installed:

- Docker Desktop (or Docker Engine)
- Docker Compose (Docker Desktop already includes it)

You can verify installation with:

```
docker --version
docker compose version
```

## 1. Clone the repository

```
git clone https://github.com/jadsow/pridia.git
cd pridia
```

---

## 2. Start the full stack

```
docker compose up
```

This will start:

- Frontend (Vite)
- Backend (Express)
- PostgreSQL
- Ollama
- Local LLM model (downloaded automatically)

⚠️ The **first run may take a few minutes** because the AI model will be downloaded.

Frontend URL:

```
http://localhost:5173
```

Backend API URL:

```
http://localhost:3001
```

Ollama URL:

```
http://localhost:11434
```

---

# Example API Usage

### Create a project

```
POST /projects
```

Request body:

```
{
  "name": "Pridia",
  "idea": "AI assistant that generates PRDs"
}
```

---

### Add discovery answers

```
POST /projects/:id/discovery
```

---

### Generate PRD

```
POST /projects/:id/generate-prd
```

The system will:

1. Collect discovery answers
2. Generate a structured prompt
3. Send the prompt to the local LLM
4. Store the generated PRD in PostgreSQL

---

# Example Generated PRD

The AI generates structured documentation such as:

```
# Product Requirement Document

## Overview
...

## Problem Statement
...

## Target Users
...

## Core Features
...

## Success Metrics
...
```

---

# Roadmap

Planned improvements:

- [x] Project creation
- [x] Discovery answers
- [x] AI PRD generation
- [ ] PRD editor
- [ ] User story generation
- [ ] Frontend interface
- [ ] Authentication
- [ ] Collaboration features

---

# About

Pridia is a portfolio project focused on:

- AI-assisted product documentation
- backend architecture
- clean architecture principles
- local AI model integration
- dockerized development environments

The goal of the project is to explore how **AI can assist product teams during the early stages of product discovery and documentation**.
