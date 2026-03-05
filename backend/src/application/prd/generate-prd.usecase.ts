import { randomUUID } from "crypto";
import { DiscoveryRepository } from "../../domain/discovery/discovery.repository";
import { PRDRepository } from "../../domain/prd/prd.repository";
import { PRD } from "../../domain/prd/prd.entity";
import { AIService } from "../../domain/ai/ai.service";

export class GeneratePRDUseCase {
  constructor(
    private discoveryRepository: DiscoveryRepository,
    private prdRepository: PRDRepository,
    private aiService: AIService,
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

    const prompt = `
You are a senior product manager.

Using the discovery answers below, fill the following PRD template.

Discovery answers:
${discoveryText}

Return ONLY the completed document in Markdown.

Template:

# Product Requirement Document

## 1. Overview

## 2. Problem Statement

## 3. Target Users

## 4. Goals

## 5. Core Features

## 6. User Flow

## 7. Success Metrics
`;

    const content = await this.aiService.generatePRD(prompt);

    const prd = new PRD(randomUUID(), projectId, content, new Date());

    await this.prdRepository.save(prd);

    return prd;
  }
}
