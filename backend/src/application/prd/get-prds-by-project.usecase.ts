import { PRDRepository } from "../../domain/prd/prd.repository";

export class GetPRDsByProjectUseCase {
  constructor(private prdRepository: PRDRepository) {}

  async execute(projectId: string) {
    return this.prdRepository.findByProject(projectId);
  }
}
