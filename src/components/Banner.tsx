import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../lib/i18n';
import { ArrowRight } from 'lucide-react';
export function Banner() {
  const t = useTranslations('Banner');
  return (
    <section className="py-32 relative overflow-hidden border-t border-saudi-champagne/20">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1615397323783-943388c69fdd?auto=format&fit=crop&q=80&w=1600"
          alt=""
          className="w-full h-full object-cover object-center filter contrast-125 saturate-50" />
        
        <div className="absolute inset-0 bg-saudi-midnight/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-saudi-midnight via-saudi-midnight/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
          className="max-w-3xl mx-auto border border-saudi-champagne/30 p-12 bg-saudi-midnight/40 backdrop-blur-sm">
          
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-saudi-sand mb-8 leading-tight">
            {t('title')}
          </h2>
          <p className="text-xl text-saudi-sand/80 mb-12 font-medium leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#products"
              className="px-8 py-4 bg-saudi-champagne text-saudi-midnight font-semibold hover:bg-saudi-champagne-light transition-colors uppercase tracking-wider text-sm inline-flex items-center gap-2">
              
              {t('ctaExplore')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
            <a
              href="#agents"
              className="px-8 py-4 bg-transparent text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-champagne hover:text-saudi-midnight transition-colors uppercase tracking-wider text-sm">
              
              {t('ctaAgent')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>);

}