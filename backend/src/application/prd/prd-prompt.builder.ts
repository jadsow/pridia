import fs from "fs";
import path from "path";

export class PRDPromptBuilder {
  build(discoveryText: string): string {
    console.log("Building PRD prompt with discovery text:", discoveryText);

    const templatePath = path.resolve(
      __dirname,
      "../../templates/prd.template.md",
    );

    const template = fs.readFileSync(templatePath, "utf-8");

    console.log("Using template:", template);

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
