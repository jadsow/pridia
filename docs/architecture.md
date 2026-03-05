# Pridia Architecture Overview

This document describes the technical architecture of the **Pridia backend**, explaining the main design decisions and how the system is structured.

The goal of this architecture is to keep the system **modular, testable and maintainable** while allowing the infrastructure (database, AI models, etc.) to evolve without affecting the core business logic.

---

# System Overview

Pridia is a tool that helps product teams transform ideas into structured **Product Requirement Documents (PRDs)**.

The system guides users through a discovery process and later generates structured documentation using AI.

Current backend responsibilities include:

- project creation
- persistence
- future AI integration
- orchestration of discovery workflows

---

# High-Level Architecture

The system follows a **layered architecture inspired by Clean Architecture principles**.

Client
↓
HTTP Interface (Express Controllers)
↓
Application Layer (Use Cases)
↓
Domain Layer (Entities + Contracts)
↓
Infrastructure Layer (Database / External Services)

This separation ensures that business logic is **independent of frameworks and external tools**.

---

# Backend Layers

## Domain Layer

The domain layer represents the **core business concepts** of the application.

Responsibilities:

- define entities
- define repository contracts
- contain business rules

Example:

Project entity

Responsibilities:

- represent a product idea
- contain core attributes such as name and idea description

Example contract:

ProjectRepository

This interface defines how projects should be stored and retrieved, without specifying the storage mechanism.

---

## Application Layer

The application layer contains **use cases**.

A use case represents a **specific action the system can perform**.

Example:

CreateProjectUseCase

Responsibilities:

- validate input
- create a Project entity
- delegate persistence to a repository

The application layer **does not know about the database implementation**.

It only depends on interfaces defined in the domain layer.

---

## Infrastructure Layer

The infrastructure layer contains **technical implementations** such as:

- database access
- external APIs
- AI services

Example:

PostgresProjectRepository

This class implements the `ProjectRepository` interface and persists projects using PostgreSQL.

This allows the database to be replaced without modifying business logic.

---

## Interface Layer

The interface layer exposes the application to the outside world.

In this project it is implemented using **Express controllers and routes**.

Example:

CreateProjectController

Responsibilities:

- receive HTTP requests
- extract request data
- call the corresponding use case
- return the response

---

# Request Flow Example

Example request:

POST /projects

Flow inside the backend:

HTTP Request
↓
Express Router
↓
Controller
↓
CreateProjectUseCase
↓
ProjectRepository (interface)
↓
PostgresProjectRepository (implementation)
↓
PostgreSQL Database

---

# Dependency Direction

One of the main ideas behind Clean Architecture is that **dependencies always point inward**.

Infrastructure → Application → Domain

This ensures that:

- domain logic is independent
- infrastructure can be replaced
- the system remains testable

---

# Database Setup

PostgreSQL runs inside a Docker container.

Docker Compose is used to start the required infrastructure services.

Services currently included:

PostgreSQL → data persistence
Ollama → local LLM models for AI features

The database schema is initialized automatically using SQL scripts during container startup.

---

# Project Structure

Backend structure:

backend
│
├── src
│ ├── domain
│ ├── application
│ ├── infrastructure
│ └── interfaces
│
├── db
│ └── init.sql
│
├── .env
└── package.json

---

# Design Goals

The architecture aims to achieve:

- clear separation of concerns
- easy testing of business logic
- independence from frameworks
- flexibility to change infrastructure

---

# Future Architecture Evolution

Planned improvements include:

- discovery question workflow
- PRD generation via AI
- user story generation
- frontend interface
- collaboration features
