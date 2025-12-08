import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomModalProps {
  show: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  showConfirm?: boolean;
  autoClose?: boolean;
  duration?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  title,
  message,
  onClose,
  confirmText = 'OK',
  onConfirm,
  showConfirm = false,
  autoClose = true,
  duration = 3000,
  size = 'md',
  className,
}) => {
  useEffect(() => {
    if (show && autoClose && !showConfirm) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose, showConfirm]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full mx-4 text-center',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-primary mb-3 pr-8">{title}</h2>
        )}

        {/* Message */}
        <p className="text-gray-700 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          {showConfirm ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                className="min-w-24"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="min-w-24 bg-primary hover:bg-primary/90"
              >
                {confirmText}
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="min-w-24 bg-primary hover:bg-primary/90"
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;


