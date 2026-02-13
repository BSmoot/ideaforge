import { useCallback } from 'react';
import { useAppStore } from '@/store';
import type { IToast } from '@/types/store';
import { generateId } from '@/lib/id';
import { TOAST_DURATION_MS } from '@/lib/constants';

type ToastVariant = IToast['variant'];

interface IUseToastReturn {
  toasts: IToast[];
  addToast: (message: string, variant?: ToastVariant, duration?: number) => string;
  removeToast: (id: string) => void;
}

export function useToast(): IUseToastReturn {
  const toasts = useAppStore((s) => s.toasts);
  const storeAddToast = useAppStore((s) => s.addToast);
  const storeRemoveToast = useAppStore((s) => s.removeToast);

  const addToast = useCallback(
    (
      message: string,
      variant: ToastVariant = 'info',
      duration: number = TOAST_DURATION_MS
    ): string => {
      const id = generateId();
      storeAddToast({ id, message, variant, duration });

      if (duration > 0) {
        setTimeout(() => {
          storeRemoveToast(id);
        }, duration);
      }

      return id;
    },
    [storeAddToast, storeRemoveToast]
  );

  const removeToast = useCallback(
    (id: string): void => {
      storeRemoveToast(id);
    },
    [storeRemoveToast]
  );

  return { toasts, addToast, removeToast };
}
