import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Clock,
  Sparkles,
  ShieldCheck,
  Droplets,
  ArrowRight } from
'lucide-react';
import { products } from '../data/products';
import { ProductModal } from './ProductModal';
import { useLocale, useTranslations } from '../lib/i18n';
export function SummerSunProtection() {
  const t = useTranslations('SunProtection');
  const locale = useLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const sunscreen = products.find((p) => p.id === 'sunscreen-spf-50') ?? null;
  const tips = [
  {
    icon: ShieldCheck,
    key: 'tip1' as const
  },
  {
    icon: Clock,
    key: 'tip2' as const
  },
  {
    icon: Droplets,
    key: 'tip3' as const
  },
  {
    icon: Sparkles,
    key: 'tip4' as const
  }];

  return (
    <section
      id="summer"
      aria-label={t('title')}
      className="relative py-24 overflow-hidden bg-saudi-sand-deep border-t border-saudi-champagne/20">
      
      {/* Subtle Najdi-inspired geometric pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B1F3A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: content */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.7,
              ease: 'easeOut'
            }}>
            
            <div className="inline-flex items-center gap-2 mb-6 border-b border-saudi-champagne pb-2">
              <Sun className="w-4 h-4 text-saudi-champagne" />
              <span className="text-xs font-semibold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-saudi-midnight leading-tight mb-6">
              {t('titleLine1')}{' '}
              <span className="text-saudi-champagne italic">
                {t('titleLine2')}
              </span>
            </h2>

            <p className="text-lg text-saudi-ink mb-4 font-medium">
              {t('subtitle')}
            </p>
            <p className="text-base text-saudi-ink/80 mb-10 leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              {t('description')}
            </p>

            {/* Tip cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {tips.map((tip, i) =>
              <motion.div
                key={tip.key}
                initial={{
                  opacity: 0,
                  x: -10
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.4,
                  ease: 'easeOut'
                }}
                className="flex items-start gap-4 bg-saudi-sand border border-saudi-champagne/20 p-5">
                
                  <div className="w-10 h-10 border border-saudi-champagne/40 bg-saudi-sand-deep flex items-center justify-center shrink-0">
                    <tip.icon className="w-5 h-5 text-saudi-champagne" />
                  </div>
                  <div>
                    <p className="font-bold text-saudi-midnight text-sm leading-snug mb-1">
                      {t(`${tip.key}Title`)}
                    </p>
                    <p className="text-xs text-saudi-ink/70 leading-relaxed">
                      {t(`${tip.key}Desc`)}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => sunscreen && setModalOpen(true)}
                className="px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm inline-flex items-center gap-2">
                
                {t('ctaShop')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <a
                href="#products"
                className="px-8 py-4 bg-transparent text-saudi-midnight font-semibold border border-saudi-midnight hover:bg-saudi-midnight hover:text-saudi-champagne transition-colors uppercase tracking-wider text-sm">
                
                {t('ctaExplore')}
              </a>
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
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
              ease: 'easeOut'
            }}
            className="relative">
            
            <div className="relative aspect-[4/5] max-w-md mx-auto border border-saudi-champagne p-2 bg-saudi-sand">
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556228720-1c2f6bb24714?auto=format&fit=crop&q=80&w=900"
                  alt={t('imageAlt')}
                  className="w-full h-full object-cover filter contrast-125 saturate-50" />
                
                <div className="absolute inset-0 bg-saudi-midnight/10 mix-blend-multiply" />
              </div>

              {/* SPF badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-6 start-6 bg-saudi-midnight border border-saudi-champagne px-5 py-4 shadow-xl">
                
                <p className="text-[10px] font-semibold tracking-widest text-saudi-champagne uppercase mb-1">
                  {t('badgeLabel')}
                </p>
                <p className="font-serif text-3xl font-bold text-saudi-sand leading-none">
                  SPF 50+
                </p>
              </motion.div>

              {/* Bottom info card */}
              <motion.div
                animate={{
                  y: [0, 8, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1
                }}
                className="absolute bottom-6 start-6 end-6 bg-saudi-sand border border-saudi-champagne/30 p-5 shadow-xl">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-saudi-champagne/40 bg-saudi-sand-deep flex items-center justify-center shrink-0">
                    <Sun className="w-6 h-6 text-saudi-champagne" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg font-bold text-saudi-midnight leading-tight mb-1">
                      {t('cardTitle')}
                    </p>
                    <p className="text-xs text-saudi-ink/70 uppercase tracking-widest">
                      {t('cardDesc')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <ProductModal
        product={modalOpen ? sunscreen : null}
        onClose={() => setModalOpen(false)} />
      
    </section>);

}