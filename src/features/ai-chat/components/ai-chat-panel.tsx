import { useRef, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useAIChat } from '../hooks/use-ai-chat';
import { ChatInput } from './chat-input';
import { useAppStore } from '@/store';
import { formatCost } from '../services/cost-tracker';
import { cn } from '@/lib/utils';

interface AIChatPanelProps {
  ideaId: string;
  className?: string;
}

export function AIChatPanel({
  ideaId,
  className,
}: AIChatPanelProps): React.ReactElement {
  const { messages, isStreaming, sendMessage } = useAIChat();
  const totalCost = useAppStore((s) => s.totalCost);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content: string): void => {
    void sendMessage(ideaId, content);
  };

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-accent-text" />
          <span className="text-sm font-medium text-foreground">AI Chat</span>
        </div>
        {totalCost > 0 && (
          <span className="text-xs text-foreground-tertiary" title="Session cost">
            {formatCost(totalCost)}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="py-8 text-center text-sm text-foreground-tertiary">
            <p>Ask questions about this idea.</p>
            <p className="mt-1 text-xs">
              The AI will use your idea as context.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'rounded-lg px-3 py-2 text-sm',
              msg.role === 'user'
                ? 'ml-8 bg-accent-subtle text-foreground'
                : 'mr-8 bg-background-muted text-foreground-secondary'
            )}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Loader2 className="h-3 w-3 animate-spin" />
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
