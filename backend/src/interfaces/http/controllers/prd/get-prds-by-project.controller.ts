import { Request, Response } from "express";
import { GetPRDsByProjectUseCase } from "../../../../application/prd/get-prds-by-project.usecase";

export class GetPRDsByProjectController {
  constructor(private useCase: GetPRDsByProjectUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = Array.isArray(id) ? id[0] : id;

      const prds = await this.useCase.execute(projectId);

      res.status(200).json(prds);
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
