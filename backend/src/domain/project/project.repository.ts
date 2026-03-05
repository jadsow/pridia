import { Project } from "./project.entity";

export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  getAll(): Promise<Project[]>;
}
