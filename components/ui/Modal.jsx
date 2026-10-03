'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsClient } from '@/hooks/useIsClient';
import { useTranslations } from '@/lib/i18n';

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

/** Accessible dialog: portal, ESC to close, body scroll lock, focus on open. */
export function Modal({ open, onClose, title, description, size = 'md', children, footer }) {
  const isClient = useIsClient();
  const tCommon = useTranslations('Common');
  const titleId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="relative h-full w-full overflow-y-auto overscroll-contain">
            <div className="min-h-full flex items-end sm:items-center justify-center p-0 sm:p-6">
              <motion.div
                ref={panelRef}
                tabIndex={-1}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full ${SIZES[size]} bg-white rounded-t-3xl sm:rounded-3xl shadow-cardHover focus:outline-none`}
              >
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 id={titleId} className="font-serif text-2xl font-bold text-slate-900">
                      {title}
                    </h2>
                    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={tCommon('close')}
                    className="shrink-0 w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-6 py-5">{children}</div>
                {footer && (
                  <div className="flex flex-wrap justify-end gap-3 px-6 pb-6">{footer}</div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
