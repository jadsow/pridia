import { PRDRepository } from "../../domain/prd/prd.repository";

export class UpdatePRDContentUseCase {
  constructor(private prdRepository: PRDRepository) {}

  async execute(projectId: string, prdId: string, content: string) {
    if (!content || !content.trim()) {
      throw new Error("PRD content cannot be empty");
    }

    const existingPRD = await this.prdRepository.findById(
      projectId,
      prdId,
    );

    if (!existingPRD) {
      throw new Error("PRD not found for this project");
    }

    await this.prdRepository.updateContent(projectId, prdId, content);

    const updatedPRD = await this.prdRepository.findById(projectId, prdId);

    if (!updatedPRD) {
      throw new Error("Failed to load updated PRD");
    }

    return updatedPRD;
  }
}
