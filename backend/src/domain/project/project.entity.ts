export class Project {
  constructor(
    public id: string,
    public name: string,
    public idea: string,
    public userId: string | undefined,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
