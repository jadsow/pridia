import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../../application/project/create-project.usecase";
import { randomUUID } from "node:crypto";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export class CreateProjectController {
  constructor(private createProjectUseCase: CreateProjectUseCase) {}

  async handle(req: Request, res: Response) {
    const { name, idea } = req.body;
    const userId = req.user?.id;

    const project = await this.createProjectUseCase.execute({
      name,
      idea,
      userId,
    });

    return res.status(201).json(project);
  }
}
