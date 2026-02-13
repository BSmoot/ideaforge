import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import type { IIdea, IAIConfig, IAIMessage } from '@/types';
import { AIServiceError } from '@/lib/errors';
import { withRetry } from '@/lib/retry';
import { buildSystemPrompt } from './context-builder';
import { calculateCost } from './cost-tracker';

interface IChatResult {
  readonly response: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly cost: number;
}

function createProvider(config: IAIConfig) {
  if (config.provider === 'anthropic') {
    return createAnthropic({
      apiKey: config.apiKey,
      headers: { 'anthropic-dangerous-direct-browser-access': 'true' },
    });
  }
  return createOpenAI({ apiKey: config.apiKey });
}

export async function chat(
  idea: IIdea,
  userMessage: string,
  history: IAIMessage[],
  config: IAIConfig,
  onToken?: (token: string) => void
): Promise<IChatResult> {
  const provider = createProvider(config);
  const systemPrompt = buildSystemPrompt(idea);

  const messages = history.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));
  messages.push({ role: 'user', content: userMessage });

  // Only retry the initial connection, NOT the stream (WARN-04)
  const result = await withRetry(
    async () => {
      try {
        return await streamText({
          model: provider(config.model),
          system: systemPrompt,
          messages,
        });
      } catch (error: unknown) {
        throw new AIServiceError(
          error instanceof Error ? error.message : 'AI request failed',
          { provider: config.provider, model: config.model },
          true
        );
      }
    },
    { maxRetries: 2, baseDelayMs: 1000 }
  );

  // Stream tokens - do NOT retry streaming (WARN-04)
  let fullResponse = '';
  try {
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
      onToken?.(chunk);
    }
  } catch (error: unknown) {
    throw new AIServiceError(
      'Stream interrupted',
      { partialResponse: fullResponse.slice(0, 200) },
      false
    );
  }

  const usage = await result.usage;
  const inputTokens = usage?.promptTokens ?? 0;
  const outputTokens = usage?.completionTokens ?? 0;
  const cost = calculateCost(config.model, inputTokens, outputTokens);

  return { response: fullResponse, inputTokens, outputTokens, cost };
}
