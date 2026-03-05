import { Router, Request, Response } from "express";

import { GeneratePRDUseCase } from "../../../application/prd/generate-prd.usecase";
import { GeneratePRDController } from "../controllers/prd/generate-prd.controller";

import { PostgresPRDRepository } from "../../../infra/db/prd.repository.impl";
import { PostgresDiscoveryRepository } from "../../../infra/db/discovery-answers.repository.impl";
import { OllamaService } from "../../../infra/ai/ollama.service";

const prdRouter = Router();

const aiService = new OllamaService();

// Repositories
const prdRepository = new PostgresPRDRepository();
const discoveryRepository = new PostgresDiscoveryRepository();

// Use case
const generatePRDUseCase = new GeneratePRDUseCase(
  discoveryRepository,
  prdRepository,
  aiService,
);

// Controller
const generatePRDController = new GeneratePRDController(
  generatePRDUseCase,
);

// Route
prdRouter.post("/:id/generate-prd", (req: Request, res: Response) =>
  generatePRDController.handle(req, res),
);

export default prdRouter;
