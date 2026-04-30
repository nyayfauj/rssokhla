import { useUIStore } from '@/stores/ui.store';
import type { ToastType } from '@/stores/ui.store';

export function useToast() {
  const addToast = useUIStore((state) => state.addToast);

  const showToast = ({ 
    title, 
    message, 
    type = 'info', 
    duration = 4000 
  }: { 
    title?: string; 
    message: string; 
    type?: ToastType; 
    duration?: number; 
  }) => {
    addToast({
      message: title ? `${title}: ${message}` : message,
      type,
      duration,
    });
  };

  return { showToast };
}
