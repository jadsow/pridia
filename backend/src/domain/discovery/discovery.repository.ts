import { DiscoveryAnswer } from "./discovery-answers.entity";

export interface DiscoveryRepository {
  save(answer: DiscoveryAnswer): Promise<void>;
  findByProject(projectId: string): Promise<DiscoveryAnswer[]>;
}
