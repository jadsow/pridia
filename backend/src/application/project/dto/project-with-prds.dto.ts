export interface ProjectWithPRDsDTO {
  id: string;
  name: string;
  idea: string;
  createdAt: Date;
  updatedAt: Date;

  prds: {
    id: string;
    createdAt: Date;
    preview: string;
  }[];
}
