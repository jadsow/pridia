import { randomUUID } from "crypto";
import { DiscoveryRepository } from "../../domain/discovery/discovery.repository";
import { DiscoveryAnswer } from "../../domain/discovery/discovery-answers.entity";
import { ValidationError } from "../../domain/errors/validation.error";

export class CreateDiscoveryAnswerUseCase {
  constructor(private repository: DiscoveryRepository) {}

  async execute(projectId: string, question: string, answer: string) {
    if (!projectId || projectId.trim() === "") {
      throw new ValidationError("Project ID is required");
    }

    if (!question || question.trim() === "") {
      throw new ValidationError("Question is required");
    }

    if (!answer || answer.trim() === "") {
      throw new ValidationError("Answer is required");
    }

    const discovery = new DiscoveryAnswer(
      randomUUID(),
      projectId,
      question,
      answer,
      new Date(),
    );

    await this.repository.save(discovery);

    return discovery;
  }
}
