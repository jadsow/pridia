import { Project } from "../../domain/project/project.entity";
import { ProjectRepository } from "../../domain/project/project.repository";
import { randomUUID } from "node:crypto";

interface CreateProjectInput {
  name: string;
  idea: string;
  userId: string | undefined;
}

export class CreateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(input: CreateProjectInput) {
    const project = new Project(
      randomUUID(),
      input.name,
      input.idea,
      input.userId,
      new Date(),
      new Date(),
    );

    await this.projectRepository.save(project);

    return project;
  }
}
