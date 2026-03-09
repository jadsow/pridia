import { AIService } from "../../domain/ai/ai.service";

export class OllamaService implements AIService {
  async generatePRD(prompt: string): Promise<string> {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
      }),
    });

    const data = (await response.json()) as { response: string };

    return data.response;
  }
}
