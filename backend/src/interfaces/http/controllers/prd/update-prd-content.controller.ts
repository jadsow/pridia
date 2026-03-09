import { Request, Response } from "express";
import { UpdatePRDContentUseCase } from "../../../../application/prd/update-prd-content.usecase";

export class UpdatePRDContentController {
  constructor(private useCase: UpdatePRDContentUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id, prdId } = req.params;
      const { content } = req.body;

      const projectId = Array.isArray(id) ? id[0] : id;
      const parsedPrdId = Array.isArray(prdId) ? prdId[0] : prdId;

      const updatedPRD = await this.useCase.execute(
        projectId,
        parsedPrdId,
        content,
      );

      res.status(200).json(updatedPRD);
    } catch (error) {
      const message = (error as Error).message;
      const statusCode = message.includes("not found") ? 404 : 400;

      res.status(statusCode).json({ message });
    }
  }
}
