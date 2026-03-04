export class Document {
  constructor(
    public id: string,
    public projectId: string,
    public type: "prd" | "user_stories",
    public content: string,
    public version: number,
    public createdAt: Date,
  ) {}
}
