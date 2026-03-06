import fs from "fs";
import path from "path";

export class PRDPromptBuilder {
  build(discoveryText: string): string {
    const templatePath = path.resolve(
      __dirname,
      "../../../templates/prd-template.md",
    );

    const template = fs.readFileSync(templatePath, "utf-8");

    return `
You are a senior product manager.

Using the discovery answers below, fill the following Product Requirement Document template.

Return ONLY the completed document in Markdown.

Discovery answers:

${discoveryText}

Template:

${template}
`;
  }
}
