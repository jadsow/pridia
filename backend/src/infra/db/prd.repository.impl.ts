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

  async findByProject(projectId: string): Promise<PRD[]> {
    const result = await pool.query(
      `SELECT * FROM prds WHERE project_id = $1 ORDER BY created_at DESC`,
      [projectId],
    );

    return result.rows.map(
      (row) =>
        new PRD(row.id, row.project_id, row.content, row.created_at),
    );
  }

  async findById(projectId: string, prdId: string): Promise<PRD | null> {
    const result = await pool.query(
      `SELECT * FROM prds WHERE project_id = $1 AND id = $2 LIMIT 1`,
      [projectId, prdId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new PRD(row.id, row.project_id, row.content, row.created_at);
  }

  async update(prd: PRD): Promise<void> {
    await pool.query(
      `
      UPDATE prds
      SET content = $1
      WHERE project_id = $2 AND id = $3
      `,
      [prd.content, prd.projectId, prd.id],
    );
  }

  async updateContent(
    projectId: string,
    prdId: string,
    content: string,
  ): Promise<void> {
    await pool.query(
      `
      UPDATE prds
      SET content = $1
      WHERE project_id = $2 AND id = $3
      `,
      [content, projectId, prdId],
    );
  }
}
