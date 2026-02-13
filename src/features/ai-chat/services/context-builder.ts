import type { IIdea } from '@/types';
import { MAX_AI_CONTEXT_LENGTH } from '@/lib/constants';

export function buildSystemPrompt(idea: IIdea): string {
  const truncatedContent =
    idea.content.length > MAX_AI_CONTEXT_LENGTH
      ? idea.content.slice(0, MAX_AI_CONTEXT_LENGTH) + '... [truncated]'
      : idea.content;

  return `You are an AI thinking partner helping develop ideas. You are assisting with the following idea:

Title: ${idea.title}
Status: ${idea.status}
Content:
${truncatedContent}

Your role:
- Help the user develop, refine, and strengthen this idea
- Ask probing questions to identify gaps
- Suggest improvements and alternative approaches
- Be concise and actionable
- Reference specific parts of the idea when relevant`;
}
