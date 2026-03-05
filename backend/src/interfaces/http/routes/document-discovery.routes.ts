import { Router, Request, Response } from "express";
import { PostgresDiscoveryRepository } from "../../../infra/db/discovery-answers.repository.impl";
import { CreateDiscoveryAnswerUseCase } from "../../../application/document/create-discovery-answers.usecase";
import { CreateDiscoveryAnswerController } from "../controllers/documents/create-discovery-answers.controller";

const documentDiscoveryRouter = Router();

// Instanciar dependências
const documentRepository = new PostgresDiscoveryRepository();

//Create Project
const createDocumentAnswersUseCase = new CreateDiscoveryAnswerUseCase(
  documentRepository,
);
const createDocumentAnswersController =
  new CreateDiscoveryAnswerController(createDocumentAnswersUseCase);

// Rotas
documentDiscoveryRouter.post(
  "/:id/discovery",
  (req: Request, res: Response) => {
    createDocumentAnswersController.handle(req, res);
  },
);

export default documentDiscoveryRouter;
