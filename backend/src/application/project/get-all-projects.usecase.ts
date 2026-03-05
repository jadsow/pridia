import { ProjectRepository } from "../../domain/project/project.repository";

export class GetAllProjectsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async getAll() {
    return await this.projectRepository.getAll();
  }
}
