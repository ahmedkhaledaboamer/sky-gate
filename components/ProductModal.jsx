import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Beaker, Package, BookOpen } from 'lucide-react';
import type { Product } from '../data/products';
import { useLocale, useTranslations } from '../lib/i18n';
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}
export function ProductModal({ product, onClose }: ProductModalProps) {
  const t = useTranslations('ProductModal');
  const locale = useLocale();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // Lock body scroll & ESC to close
  useEffect(() => {
    if (!product) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Move focus into the dialog
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);
  if (typeof document === 'undefined') return null;
  const modal =
  <AnimatePresence>
      {product &&
    <div
      className="fixed inset-0 z-[9999]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="product-modal-title">
      
          {/* Backdrop */}
          <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.2
        }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
      

          {/* Scroll container — handles overflow for long content & small screens */}
          <div className="relative h-full w-full overflow-y-auto overscroll-contain">
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
              <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.96
            }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 240
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-cardHover border border-slate-100 grid md:grid-cols-2 overflow-hidden my-auto">
            
                {/* Close button — always on top */}
                <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label={t('close')}
              className="absolute top-4 end-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              
                  <X className="w-5 h-5" />
                </button>

                {/* Image side */}
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8 md:p-12 min-h-[280px] md:min-h-[560px]">
                  <img
                src={product.image}
                alt={product.name[locale]}
                className="relative max-h-[280px] md:max-h-[460px] w-auto object-contain" />
              
                </div>

                {/* Content side */}
                <div className="p-6 md:p-10 bg-white md:max-h-[calc(100vh-4rem)] md:overflow-y-auto">
                  <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-semibold uppercase tracking-widest mb-4">
                    {product.category}
                  </span>
                  <h2
                id="product-modal-title"
                className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                
                    {product.name[locale]}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-8">
                    {product.fullDescription[locale]}
                  </p>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Check className="w-4 h-4 text-teal-500" />{' '}
                      {t('benefits')}
                    </h3>
                    <ul className="space-y-2">
                      {product.benefits.map((b) =>
                  <li
                    key={b.en}
                    className="flex items-start gap-2 text-sm text-slate-700">
                    
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                          {b[locale]}
                        </li>
                  )}
                    </ul>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Beaker className="w-4 h-4 text-teal-500" />{' '}
                      {t('ingredients')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((i) =>
                  <span
                    key={i.en}
                    className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                    
                          {i[locale]}
                        </span>
                  )}
                    </div>
                  </div>

                  {/* Directions */}
                  {product.directions &&
              <div className="mb-6">
                      <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <BookOpen className="w-4 h-4 text-teal-500" />{' '}
                        {t('directions')}
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-4">
                        {product.directions[locale]}
                      </p>
                    </div>
              }

                  {/* Sizes */}
                  <div className="mb-8">
                    <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Package className="w-4 h-4 text-teal-500" /> {t('sizes')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) =>
                  <span
                    key={s.en}
                    className="px-3 py-1.5 rounded-full border border-slate-300 text-sm text-slate-700 font-medium">
                    
                          {s[locale]}
                        </span>
                  )}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                href="/#contact"
                onClick={onClose}
                className="block w-full text-center px-6 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-teal-500 transition-colors text-sm tracking-wide shadow-soft hover:shadow-card">
                
                    {t('cta')}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
    }
    </AnimatePresence>;

  return createPortal(modal, document.body);
}