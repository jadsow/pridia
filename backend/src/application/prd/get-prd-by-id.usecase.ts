import { PRDRepository } from "../../domain/prd/prd.repository";

export class GetPRDByIdUseCase {
  constructor(private prdRepository: PRDRepository) {}

  async execute(projectId: string, prdId: string) {
    const prd = await this.prdRepository.findById(projectId, prdId);

    if (!prd) {
      throw new Error("PRD not found for this project");
    }

    return prd;
  }
}
