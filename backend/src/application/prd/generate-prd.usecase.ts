import { randomUUID } from "crypto";
import { DiscoveryRepository } from "../../domain/discovery/discovery.repository";
import { PRDRepository } from "../../domain/prd/prd.repository";
import { PRD } from "../../domain/prd/prd.entity";
import { AIService } from "../../domain/ai/ai.service";
import { PRDPromptBuilder } from "./prd-prompt.builder";

export class GeneratePRDUseCase {
  constructor(
    private discoveryRepository: DiscoveryRepository,
    private prdRepository: PRDRepository,
    private aiService: AIService,
    private prdPromptBuilder: PRDPromptBuilder,
  ) {}

  async execute(projectId: string) {
    const answers =
      await this.discoveryRepository.findByProject(projectId);

    if (answers.length === 0) {
      throw new Error("No discovery answers found");
    }

    const discoveryText = answers
      .map((a) => `Question: ${a.question}\nAnswer: ${a.answer}`)
      .join("\n\n");

    console.log("Discovery answersssss:", discoveryText);

    const prompt = this.prdPromptBuilder.build(discoveryText);

    const content = await this.aiService.generatePRD(prompt);

    const prd = new PRD(randomUUID(), projectId, content, new Date());

    await this.prdRepository.save(prd);

    return prd;
  }
}
