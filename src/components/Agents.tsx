import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  Package,
  Megaphone,
  ArrowRight } from
'lucide-react';
import { useTranslations } from '../lib/i18n';
import { AgencyRequestModal } from './AgencyRequestModal';
export function Agents() {
  const t = useTranslations('Agents');
  const [modalOpen, setModalOpen] = useState(false);
  const benefits = [
  {
    icon: Briefcase,
    key: 'benefit1' as const
  },
  {
    icon: Megaphone,
    key: 'benefit2' as const
  },
  {
    icon: TrendingUp,
    key: 'benefit3' as const
  },
  {
    icon: Package,
    key: 'benefit4' as const
  }];

  return (
    <section
      id="agents"
      className="py-24 bg-saudi-sand-deep relative overflow-hidden border-t border-saudi-champagne/20">
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className="relative">
            
            <div className="border border-saudi-champagne p-2 bg-saudi-sand aspect-[4/3]">
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src="./images/care/banner12.jpeg"
                  alt="Business partnership and boutique"
                  className="w-full h-full object-cover " />
                
                <div className="absolute inset-0 bg-saudi-midnight/10 mix-blend-multiply" />
              </div>
            </div>

            <div className="absolute -bottom-6 -end-6 bg-saudi-midnight p-6 border border-saudi-champagne max-w-[220px]">
              <p className="font-serif text-3xl font-bold text-saudi-champagne mb-2">
                {t('badge1')}
              </p>
              <p className="text-xs text-saudi-sand/80 font-medium uppercase tracking-widest leading-relaxed">
                {t('badge2')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-saudi-ink/80 text-lg mb-10 leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              {t('description')}
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit) =>
              <div
                key={benefit.key}
                className="flex items-start gap-4 bg-saudi-sand p-5 border border-saudi-champagne/20">
                
                  <div className="w-10 h-10 border border-saudi-champagne/40 bg-saudi-sand-deep flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-saudi-champagne" />
                  </div>
                  <p className="font-bold text-saudi-midnight mt-2 text-sm">
                    {t(benefit.key)}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm inline-flex items-center gap-2">
              
              {t('cta')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </motion.div>
        </div>
      </div>

      <AgencyRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)} />
      
    </section>);

}