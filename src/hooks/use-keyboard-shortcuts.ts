import { useEffect } from 'react';

interface IKeyboardShortcutHandlers {
  onNewSpark?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return true;
  }
  return target.isContentEditable;
}

export function useKeyboardShortcuts(handlers: IKeyboardShortcutHandlers): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      const mod = e.metaKey || e.ctrlKey;

      // Escape always fires (even in editable fields)
      if (e.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape();
        return;
      }

      // Don't fire shortcuts when typing in inputs
      if (isEditableTarget(e.target)) return;

      if (mod && e.key === 'n') {
        e.preventDefault();
        handlers.onNewSpark?.();
        return;
      }

      if (mod && e.key === 'k') {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
