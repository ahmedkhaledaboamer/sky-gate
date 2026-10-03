'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsClient } from '@/hooks/useIsClient';
import { useLocale, useTranslations } from '@/lib/i18n';

/** Side sheet used for mobile filters and the mobile dashboard sidebar. */
export function Drawer({ open, onClose, title, side = 'start', children, className = 'w-[86vw] max-w-sm' }) {
  const isClient = useIsClient();
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  // "start" is left in LTR and right in RTL
  const fromLeft = (side === 'start') === (locale !== 'ar');

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9998]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: fromLeft ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: fromLeft ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`absolute top-0 bottom-0 ${fromLeft ? 'left-0' : 'right-0'} bg-white shadow-cardHover flex flex-col ${className}`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-serif text-xl font-bold text-slate-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={tCommon('close')}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
