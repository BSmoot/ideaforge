export interface IAIInteraction {
  readonly id: string;
  readonly idea_id: string;
  readonly prompt: string;
  readonly response: string;
  readonly model: string;
  readonly input_tokens: number | null;
  readonly output_tokens: number | null;
  readonly cost_estimate: number | null;
  readonly created_at: string;
}

export interface IAIMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly timestamp: string;
}

export type AIProvider = 'anthropic' | 'openai';

export interface IAIConfig {
  readonly provider: AIProvider;
  readonly apiKey: string;
  readonly model: string;
}
