import { PRD } from "./prd.entity";

export interface PRDRepository {
  save(prd: PRD): Promise<void>;
  findByProject(projectId: string): Promise<PRD | null>;
  update(prd: PRD): Promise<void>;
}
