import { useCallback } from 'react';
import type { IAIConfig, IAIMessage } from '@/types';
import { useAppStore } from '@/store';
import { useDatabase } from '@/database/database-context';
import { useToast } from '@/hooks/use-toast';
import { SettingsRepository } from '@/database/repositories/settings-repository';
import { AIInteractionRepository } from '@/database/repositories/ai-interaction-repository';
import { chat } from '../services/ai-service';
import { nowISO } from '@/lib/date';

interface IUseAIChatReturn {
  messages: IAIMessage[];
  isStreaming: boolean;
  sendMessage: (ideaId: string, content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(): IUseAIChatReturn {
  const { db, manager } = useDatabase();
  const messages = useAppStore((s) => s.messages);
  const isStreaming = useAppStore((s) => s.isStreaming);
  const addMessage = useAppStore((s) => s.addMessage);
  const clearMessages = useAppStore((s) => s.clearMessages);
  const setStreaming = useAppStore((s) => s.setStreaming);
  const addCost = useAppStore((s) => s.addCost);
  const { addToast } = useToast();

  const getConfig = useCallback((): IAIConfig | null => {
    const repo = new SettingsRepository(db);
    const provider = repo.get('ai_provider');
    const apiKey = repo.get('ai_api_key');
    const model = repo.get('ai_model');
    if (!provider || !apiKey || !model) return null;
    return {
      provider: provider as IAIConfig['provider'],
      apiKey,
      model,
    };
  }, [db]);

  const sendMessage = useCallback(
    async (ideaId: string, content: string): Promise<void> => {
      const config = getConfig();
      if (!config) {
        addToast('Configure AI in Settings first', 'warning');
        return;
      }

      const { IdeaRepository } = await import(
        '@/database/repositories/idea-repository'
      );
      const ideaRepo = new IdeaRepository(db);
      const idea = ideaRepo.getById(ideaId);
      if (!idea) {
        addToast('Idea not found', 'error');
        return;
      }

      const userMsg: IAIMessage = {
        role: 'user',
        content,
        timestamp: nowISO(),
      };
      addMessage(userMsg);
      setStreaming(true);

      let fullResponse = '';
      const assistantMsg: IAIMessage = {
        role: 'assistant',
        content: '',
        timestamp: nowISO(),
      };

      try {
        const result = await chat(
          idea,
          content,
          messages,
          config,
          (token: string) => {
            fullResponse += token;
          }
        );

        addMessage({
          ...assistantMsg,
          content: result.response,
        });

        addCost(result.cost);

        // Save to database
        const aiRepo = new AIInteractionRepository(db);
        aiRepo.create({
          idea_id: ideaId,
          prompt: content,
          response: result.response,
          model: config.model,
          input_tokens: result.inputTokens,
          output_tokens: result.outputTokens,
          cost_estimate: result.cost,
        });
        await manager.persist();
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : 'AI request failed';
        addToast(msg, 'error');

        if (fullResponse) {
          addMessage({
            ...assistantMsg,
            content: fullResponse + '\n\n[Response interrupted]',
          });
        }
      } finally {
        setStreaming(false);
      }
    },
    [db, manager, messages, getConfig, addMessage, setStreaming, addCost, addToast]
  );

  return { messages, isStreaming, sendMessage, clearMessages };
}
