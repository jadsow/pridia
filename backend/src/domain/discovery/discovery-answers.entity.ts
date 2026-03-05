export class DiscoveryAnswer {
  constructor(
    public id: string,
    public projectId: string,
    public question: string,
    public answer: string,
    public createdAt: Date,
  ) {}
}
