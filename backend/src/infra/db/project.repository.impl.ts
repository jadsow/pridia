import { ProjectRepository } from "../../domain/project/project.repository";
import { Project } from "../../domain/project/project.entity";
import { pool } from "./pg-client";

export class PostgresProjectRepository implements ProjectRepository {
  async getAll(): Promise<Project[]> {
    const result = await pool.query(`SELECT * FROM projects`);
    return result.rows.map(
      (row) =>
        new Project(
          row.id,
          row.name,
          row.idea,
          row.user_id,
          row.created_at,
          row.updated_at,
        ),
    );
  }

  async save(project: Project): Promise<void> {
    await pool.query(
      `
      INSERT INTO projects (id, name, idea, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        project.id,
        project.name,
        project.idea,
        project.createdAt,
        project.updatedAt,
      ],
    );
  }

  async findById(id: string): Promise<Project | null> {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return new Project(
      row.id,
      row.name,
      row.idea,
      row.user_id,
      row.created_at,
      row.updated_at,
    );
  }
}
