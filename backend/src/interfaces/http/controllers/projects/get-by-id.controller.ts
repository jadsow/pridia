import { Request, Response } from "express";
import { GetProjectByIdUseCase } from "../../../../application/project/get-project-by-id.usecase";

export class GetProjectByIdController {
  constructor(private useCase: GetProjectByIdUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const projectId = Array.isArray(id) ? id[0] : id;

    const project = await this.useCase.execute(projectId);

    res.json(project);
  }
}
