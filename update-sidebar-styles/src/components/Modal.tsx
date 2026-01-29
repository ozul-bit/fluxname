import { useEffect } from 'react';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] transition-all",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={cn(
        "bg-slate-800 rounded-2xl p-7 w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto transition-transform",
        isOpen ? "scale-100" : "scale-90"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-100">{title}</h3>
          <button 
            className="bg-transparent border-none text-slate-400 text-2xl cursor-pointer hover:text-slate-100"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
