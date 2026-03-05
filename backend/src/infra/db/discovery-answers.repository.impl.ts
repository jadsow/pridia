import { pool } from "./pg-client";
import { DiscoveryRepository } from "../../domain/discovery/discovery.repository";
import { DiscoveryAnswer } from "../../domain/discovery/discovery-answers.entity";

export class PostgresDiscoveryRepository implements DiscoveryRepository {
  async save(answer: DiscoveryAnswer): Promise<void> {
    await pool.query(
      `
      INSERT INTO discovery_answers
      (id, project_id, question, answer, created_at)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        answer.id,
        answer.projectId,
        answer.question,
        answer.answer,
        answer.createdAt,
      ],
    );
  }

  async findByProject(projectId: string): Promise<DiscoveryAnswer[]> {
    const result = await pool.query(
      `SELECT * FROM discovery_answers WHERE project_id = $1`,
      [projectId],
    );

    return result.rows.map(
      (row) =>
        new DiscoveryAnswer(
          row.id,
          row.project_id,
          row.question,
          row.answer,
          row.created_at,
        ),
    );
  }
}
