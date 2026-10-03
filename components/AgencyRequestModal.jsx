import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check } from 'lucide-react';
import { useTranslations } from '../lib/i18n';
import { sendToEmail } from '../lib/sendToEmail';
interface AgencyRequestModalProps {
  open: boolean;
  onClose: () => void;
}
const RECIPIENT_EMAIL = 'royalcareuae@hotmail.com';
export function AgencyRequestModal({ open, onClose }: AgencyRequestModalProps) {
  const t = useTranslations('AgencyModal');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [submitted, setSubmitted] = useState(false);
  // Lock scroll + ESC to close
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  // Reset on close
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setForm({
          name: '',
          email: '',
          phone: '',
          description: ''
        });
        setSubmitted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);
  const handleChange =
  (field: keyof typeof form) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({
      ...f,
      [field]: e.target.value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendToEmail({
      subject: `Agency Request from ${form.name}`,
      fields: {
        Name: form.name,
        Email: form.email,
        Phone: form.phone,
        Description: form.description
      }
    });
    setSubmitted(true);
  };
  return (
    <AnimatePresence>
      {open &&
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        aria-modal="true"
        role="dialog"
        aria-labelledby="agency-modal-title">
        
          <div
          className="absolute inset-0 bg-saudi-midnight/80 backdrop-blur-sm"
          onClick={onClose} />
        

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
            damping: 24,
            stiffness: 220
          }}
          className="relative bg-saudi-sand rounded-none shadow-2xl w-full max-w-lg overflow-hidden border border-saudi-champagne/30">
          
            {/* Decorative top band */}
            <div className="h-1 w-full bg-saudi-champagne" />

            <button
            onClick={onClose}
            aria-label={t('close')}
            className="absolute top-5 end-5 z-10 w-9 h-9 border border-saudi-champagne/30 flex items-center justify-center text-saudi-midnight hover:bg-saudi-champagne hover:text-saudi-midnight transition-colors">
            
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-10">
              {submitted ?
            <div className="text-center py-6">
                  <div className="w-16 h-16 border border-saudi-champagne flex items-center justify-center mx-auto mb-6 bg-saudi-sand-deep">
                    <Check className="w-8 h-8 text-saudi-champagne" />
                  </div>
                  <h3
                id="agency-modal-title"
                className="font-serif text-2xl md:text-3xl font-bold text-saudi-midnight mb-3">
                
                    {t('successTitle')}
                  </h3>
                  <p className="text-saudi-ink/80 mb-8">{t('successDesc')}</p>
                  <button
                onClick={onClose}
                className="px-8 py-3 bg-saudi-midnight text-saudi-champagne font-semibold hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm border border-saudi-champagne">
                
                    {t('done')}
                  </button>
                </div> :

            <>
                  <div className="mb-6 border-b border-saudi-champagne/20 pb-4">
                    <span className="inline-block px-3 py-1 border border-saudi-champagne text-saudi-champagne text-xs font-semibold uppercase tracking-widest mb-3">
                      {t('eyebrow')}
                    </span>
                    <h3
                  id="agency-modal-title"
                  className="font-serif text-2xl md:text-3xl font-bold text-saudi-midnight mb-2">
                  
                      {t('title')}
                    </h3>
                    <p className="text-sm text-saudi-ink/80">
                      {t('description')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-saudi-midnight mb-1.5 uppercase tracking-wider text-xs">
                        {t('name')}
                      </label>
                      <input
                    required
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder={t('namePh')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/30 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40" />
                  
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-saudi-midnight mb-1.5 uppercase tracking-wider text-xs">
                        {t('email')}
                      </label>
                      <input
                    required
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder={t('emailPh')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/30 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40" />
                  
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-saudi-midnight mb-1.5 uppercase tracking-wider text-xs">
                        {t('phone')}
                      </label>
                      <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder={t('phonePh')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/30 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40" />
                  
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-saudi-midnight mb-1.5 uppercase tracking-wider text-xs">
                        {t('descriptionLabel')}
                      </label>
                      <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder={t('descriptionPh')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/30 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40 resize-none" />
                  
                    </div>

                    <button
                  type="submit"
                  className="w-full mt-6 py-3.5 bg-saudi-midnight text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2">
                  
                      <Send className="w-4 h-4 rtl:rotate-180" />
                      {t('submit')}
                    </button>
                  </form>
                </>
            }
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}