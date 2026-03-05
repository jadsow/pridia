export class PRD {
  constructor(
    public id: string,
    public projectId: string,
    public content: string,
    public createdAt: Date,
  ) {
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    if (!content) {
      throw new Error("PRD content cannot be empty");
    }
  }
}
