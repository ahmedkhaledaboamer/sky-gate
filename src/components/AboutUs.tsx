import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from '../lib/i18n';
export function AboutUs() {
  const t = useTranslations('AboutUs');
  const features = ['feature1', 'feature2', 'feature3', 'feature4'] as const;
  return (
    <section
      id="about"
      className="py-24 overflow-hidden bg-saudi-sand-deep border-t border-saudi-champagne/20">
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
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
              className="relative z-10 border border-saudi-champagne p-2 bg-saudi-sand aspect-[4/5] max-w-md mx-auto lg:mx-0">
              
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800"
                  alt="Cosmetics laboratory and product showcase"
                  className="w-full h-full object-cover filter contrast-125 saturate-50" />
                
                <div className="absolute inset-0 bg-saudi-midnight/10 mix-blend-multiply" />
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: 'easeOut'
              }}
              className="absolute -bottom-10 -end-4 lg:-end-10 z-20 border border-saudi-champagne p-2 bg-saudi-sand w-2/3 aspect-square">
              
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571781526291-c477eb311dc6?auto=format&fit=crop&q=80&w=400"
                  alt="Beauty products flat lay"
                  className="w-full h-full object-cover filter contrast-125 saturate-50" />
                
                <div className="absolute inset-0 bg-saudi-midnight/10 mix-blend-multiply" />
              </div>
            </motion.div>

            {/* Architectural accent */}
            <div className="absolute top-10 -start-10 w-32 h-32 border border-saudi-champagne/30 z-0"></div>
          </div>

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
            
            <div className="inline-flex items-center gap-2 mb-6 border-b border-saudi-champagne pb-2">
              <span className="text-xs font-semibold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight mb-8 leading-tight">
              {t('title')}
            </h2>

            <div className="space-y-6 text-saudi-ink/80 text-lg leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              <p>{t('p1')}</p>
              <p>{t('p2')}</p>
              <p>{t('p3')}</p>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 gap-6">
              {features.map((key) =>
              <div key={key} className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-saudi-champagne/40 bg-saudi-sand flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-saudi-champagne" />
                  </div>
                  <span className="font-bold text-saudi-midnight uppercase tracking-wider text-xs">
                    {t(key)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}