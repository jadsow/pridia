import { Request, Response } from "express";
import { CreateDiscoveryAnswerUseCase } from "../../../../application/document/create-discovery-answers.usecase";
import {
  ValidationError,
  NotFoundError,
} from "../../../../domain/errors/validation.error";

export class CreateDiscoveryAnswerController {
  constructor(private useCase: CreateDiscoveryAnswerUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({
          error: "Request body is required",
        });
      }

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const question = Array.isArray(req.body.question)
        ? req.body.question[0]
        : req.body.question;

      const answer = Array.isArray(req.body.answer)
        ? req.body.answer[0]
        : req.body.answer;

      const result = await this.useCase.execute(id, question, answer);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          error: error.message,
        });
      }

      if (error instanceof NotFoundError) {
        return res.status(404).json({
          error: error.message,
        });
      }

      console.error("Error in CreateDiscoveryAnswerController:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
