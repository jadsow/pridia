import { Router, Request, Response } from "express";
import { CreateProjectController } from "./interfaces/http/controllers/projects/create-project.controller";
import { CreateProjectUseCase } from "./application/project/create-project.usecase";
import { PostgresProjectRepository } from "./infra/db/project.repository.impl";
import { GetAllProjectsUseCase } from "./application/project/get-all-projects.usecase";
import { GetAllProjectsController } from "./interfaces/http/controllers/projects/get-all-projects.controller";

const projectRouter = Router();

// Instanciar dependências
const projectRepository = new PostgresProjectRepository();

//Create Project
const createProjectUseCase = new CreateProjectUseCase(projectRepository);
const createProjectController = new CreateProjectController(
  createProjectUseCase,
);

// Get All Projects
const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
const getAllProjectsController = new GetAllProjectsController(
  getAllProjectsUseCase,
);

// Rotas
projectRouter.get("/", (req: Request, res: Response) => {
  getAllProjectsController.handle(req, res);
});

projectRouter.post("/", (req: Request, res: Response) =>
  createProjectController.handle(req, res),
);

export default projectRouter;
