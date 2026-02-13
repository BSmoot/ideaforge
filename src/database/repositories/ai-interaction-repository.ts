import type { Database } from 'sql.js';
import type { IAIInteraction } from '@/types';
import { BaseRepository } from './base-repository';
import { generateId } from '@/lib/id';
import { nowISO } from '@/lib/date';

export interface ICreateAIInteractionInput {
  readonly idea_id: string;
  readonly prompt: string;
  readonly response: string;
  readonly model: string;
  readonly input_tokens: number | null;
  readonly output_tokens: number | null;
  readonly cost_estimate: number | null;
}

export class AIInteractionRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  create(input: ICreateAIInteractionInput): IAIInteraction {
    const id = generateId();
    const now = nowISO();

    this.execRun(
      `INSERT INTO ai_interactions (id, idea_id, prompt, response, model, input_tokens, output_tokens, cost_estimate, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.idea_id,
        input.prompt,
        input.response,
        input.model,
        input.input_tokens,
        input.output_tokens,
        input.cost_estimate,
        now,
      ]
    );

    return {
      id,
      idea_id: input.idea_id,
      prompt: input.prompt,
      response: input.response,
      model: input.model,
      input_tokens: input.input_tokens,
      output_tokens: input.output_tokens,
      cost_estimate: input.cost_estimate,
      created_at: now,
    };
  }

  getForIdea(ideaId: string): IAIInteraction[] {
    return this.getMany<IAIInteraction>(
      'SELECT * FROM ai_interactions WHERE idea_id = ? ORDER BY created_at ASC',
      [ideaId]
    );
  }

  getTotalCost(): number {
    return (
      this.getScalar<number>(
        'SELECT COALESCE(SUM(cost_estimate), 0) FROM ai_interactions'
      ) ?? 0
    );
  }

  getCostByModel(): Array<{ model: string; total_cost: number; count: number }> {
    return this.getMany<{ model: string; total_cost: number; count: number }>(
      `SELECT model, COALESCE(SUM(cost_estimate), 0) as total_cost, COUNT(*) as count
       FROM ai_interactions
       GROUP BY model
       ORDER BY total_cost DESC`
    );
  }
}
