import { Request, Response } from "express";
import { GeneratePRDUseCase } from "../../../../application/prd/generate-prd.usecase";

export class GeneratePRDController {
  constructor(private generatePRDUseCase: GeneratePRDUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const projectId = Array.isArray(id) ? id[0] : id;

      const prd = await this.generatePRDUseCase.execute(projectId);

      res.status(201).json(prd);
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
