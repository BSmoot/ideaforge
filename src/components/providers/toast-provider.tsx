import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function ToastProvider(): React.ReactElement {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          onClose={() => {
            removeToast(toast.id);
          }}
        >
          {toast.message}
        </Toast>
      ))}
    </div>
  );
}
