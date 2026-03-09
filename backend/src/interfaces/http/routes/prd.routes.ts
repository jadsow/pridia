import { Router, Request, Response } from "express";

import { GeneratePRDUseCase } from "../../../application/prd/generate-prd.usecase";
import { GetPRDsByProjectUseCase } from "../../../application/prd/get-prds-by-project.usecase";
import { GetPRDByIdUseCase } from "../../../application/prd/get-prd-by-id.usecase";
import { UpdatePRDContentUseCase } from "../../../application/prd/update-prd-content.usecase";
import { GeneratePRDController } from "../controllers/prd/generate-prd.controller";
import { GetPRDsByProjectController } from "../controllers/prd/get-prds-by-project.controller";
import { GetPRDByIdController } from "../controllers/prd/get-prd-by-id.controller";
import { UpdatePRDContentController } from "../controllers/prd/update-prd-content.controller";

import { PostgresPRDRepository } from "../../../infra/db/prd.repository.impl";
import { PostgresDiscoveryRepository } from "../../../infra/db/discovery-answers.repository.impl";
import { OllamaService } from "../../../infra/ai/ollama.service";
import { PRDPromptBuilder } from "../../../application/prd/prd-prompt.builder";

const prdRouter = Router();

const aiService = new OllamaService();
const prdPromptBuilder = new PRDPromptBuilder();

// Repositories
const prdRepository = new PostgresPRDRepository();
const discoveryRepository = new PostgresDiscoveryRepository();

// Use case
const generatePRDUseCase = new GeneratePRDUseCase(
  discoveryRepository,
  prdRepository,
  aiService,
  prdPromptBuilder,
);
const getPRDsByProjectUseCase = new GetPRDsByProjectUseCase(prdRepository);
const getPRDByIdUseCase = new GetPRDByIdUseCase(prdRepository);
const updatePRDContentUseCase = new UpdatePRDContentUseCase(prdRepository);

// Controller
const generatePRDController = new GeneratePRDController(
  generatePRDUseCase,
);
const getPRDsByProjectController = new GetPRDsByProjectController(
  getPRDsByProjectUseCase,
);
const getPRDByIdController = new GetPRDByIdController(getPRDByIdUseCase);
const updatePRDContentController = new UpdatePRDContentController(
  updatePRDContentUseCase,
);

// Route
prdRouter.get("/:id/prds", (req: Request, res: Response) =>
  getPRDsByProjectController.handle(req, res),
);

prdRouter.get("/:id/prds/:prdId", (req: Request, res: Response) =>
  getPRDByIdController.handle(req, res),
);

prdRouter.put("/:id/prds/:prdId", (req: Request, res: Response) =>
  updatePRDContentController.handle(req, res),
);

prdRouter.post("/:id/generate-prd", (req: Request, res: Response) =>
  generatePRDController.handle(req, res),
);

export default prdRouter;
