import { Router, Request, Response } from "express";
import { CreateProjectController } from "./interfaces/http/controllers/create-project.controller";
import { CreateProjectUseCase } from "./application/project/create-project.usecase";
import { InMemoryProjectRepository } from "./infra/db/project.repository.impl";

const projectRouter = Router();

// Instanciar dependências
const projectRepository = new InMemoryProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const createProjectController = new CreateProjectController(
  createProjectUseCase,
);

// Rotas
projectRouter.post("/", (req: Request, res: Response) =>
  createProjectController.handle(req, res),
);

export default projectRouter;
