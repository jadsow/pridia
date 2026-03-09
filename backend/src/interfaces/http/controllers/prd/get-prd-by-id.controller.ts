import { Request, Response } from "express";
import { GetPRDByIdUseCase } from "../../../../application/prd/get-prd-by-id.usecase";

export class GetPRDByIdController {
  constructor(private useCase: GetPRDByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id, prdId } = req.params;
      const projectId = Array.isArray(id) ? id[0] : id;
      const parsedPrdId = Array.isArray(prdId) ? prdId[0] : prdId;

      const prd = await this.useCase.execute(projectId, parsedPrdId);

      res.status(200).json(prd);
    } catch (error) {
      res.status(404).json({
        message: (error as Error).message,
      });
    }
  }
}
