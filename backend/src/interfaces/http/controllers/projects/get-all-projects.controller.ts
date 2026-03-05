import { Request, Response } from "express";
import { GetAllProjectsUseCase } from "../../../../application/project/get-all-projects.usecase";

export class GetAllProjectsController {
  constructor(private getAllProjectsUseCase: GetAllProjectsUseCase) {}

  async handle(req: Request, res: Response) {
    const projects = await this.getAllProjectsUseCase.getAll();
    return res.json(projects);
  }
}
