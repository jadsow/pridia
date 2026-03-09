import { PRDRepository } from "../../domain/prd/prd.repository";
import { ProjectRepository } from "../../domain/project/project.repository";
import { ProjectWithPRDsDTO } from "./dto/project-with-prds.dto";

export class GetProjectByIdUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private prdRepository: PRDRepository,
  ) {}

  async execute(projectId: string): Promise<ProjectWithPRDsDTO> {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const prds = await this.prdRepository.findByProject(projectId);

    const summaries = prds.map((prd) => ({
      id: prd.id,
      createdAt: prd.createdAt,
      preview: prd.content.substring(0, 100),
    }));

    const response: ProjectWithPRDsDTO = {
      id: project.id,
      name: project.name,
      idea: project.idea,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      prds: summaries,
    };

    return response;
  }
}
