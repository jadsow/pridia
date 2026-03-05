export interface AIService {
  generatePRD(prompt: string): Promise<string>;
}
