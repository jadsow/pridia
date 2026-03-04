import { ProjectRepository } from "../../domain/project/project.repository";
import { Project } from "../../domain/project/project.entity";

export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Project[] = [];

  async save(project: Project): Promise<void> {
    this.projects.push(project);
  }

  async findById(id: string): Promise<Project | null> {
    const project = this.projects.find((p) => p.id === id);
    return project || null;
  }
}
