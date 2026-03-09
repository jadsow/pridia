import { Router, Request, Response } from "express";
import { CreateProjectController } from "../controllers/projects/create-project.controller";
import { CreateProjectUseCase } from "../../../application/project/create-project.usecase";
import { PostgresProjectRepository } from "../../../infra/db/project.repository.impl";
import { GetAllProjectsUseCase } from "../../../application/project/get-all-projects.usecase";
import { GetAllProjectsController } from "../controllers/projects/get-all-projects.controller";
import { GetProjectByIdUseCase } from "../../../application/project/get-project-by-id.usecase";
import { GetProjectByIdController } from "../controllers/projects/get-by-id.controller";
import { PostgresPRDRepository } from "../../../infra/db/prd.repository.impl";


const projectRouter = Router();

// Instanciar dependências
const projectRepository = new PostgresProjectRepository();
const prdRepository = new PostgresPRDRepository();

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

// Get Project By ID
const getProjectByIdUseCase = new GetProjectByIdUseCase(projectRepository, prdRepository);
const getProjectByIdController = new GetProjectByIdController(getProjectByIdUseCase);

// Rotas
projectRouter.get("/", (req: Request, res: Response) => {
  getAllProjectsController.handle(req, res);
});

projectRouter.post("/", (req: Request, res: Response) =>
  createProjectController.handle(req, res),
);

projectRouter.get("/:id", (req: Request, res: Response) =>
  getProjectByIdController.handle(req, res),
);

export default projectRouter;
