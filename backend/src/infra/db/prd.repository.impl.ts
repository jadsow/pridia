import { pool } from "./pg-client";
import { PRDRepository } from "../../domain/prd/prd.repository";
import { PRD } from "../../domain/prd/prd.entity";

export class PostgresPRDRepository implements PRDRepository {
  async save(prd: PRD): Promise<void> {
    await pool.query(
      `
      INSERT INTO prds (id, project_id, content, created_at)
      VALUES ($1, $2, $3, $4)
      `,
      [prd.id, prd.projectId, prd.content, prd.createdAt],
    );
  }

  async findByProject(projectId: string): Promise<PRD | null> {
    const result = await pool.query(
      `SELECT * FROM prds WHERE project_id = $1`,
      [projectId],
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return new PRD(row.id, row.project_id, row.content, row.created_at);
  }

  async update(prd: PRD): Promise<void> {
    await pool.query(
      `
      UPDATE prds
      SET content = $1
      WHERE project_id = $2
      `,
      [prd.content, prd.projectId],
    );
  }
}
