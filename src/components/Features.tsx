import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from '../lib/i18n';
export function Features() {
  const t = useTranslations('Features');
  return (
    <section className="py-24 md:py-32 bg-saudi-sand relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
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
            duration: 0.6
          }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase mb-4">
              Our edge
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.05]">
              {t('title')}
            </h2>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed max-w-md">
            Built from the ground up around three principles: ingredient
            integrity, partner trust, and visible results.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 auto-rows-[minmax(180px,_auto)]">
          {/* Large feature image card — col-span 7, row-span 2 */}
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
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="lg:col-span-7 lg:row-span-2 group relative rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover transition-shadow duration-500 min-h-[400px] lg:min-h-[520px]">
            
            <img
              src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=1400"
              alt={t('card1Title')}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10" />

            {/* Top-right chip */}
            <div className="absolute top-6 end-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-terra" />
              Featured
            </div>

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-5xl md:text-6xl font-bold text-terra leading-none">
                  01
                </span>
                <div className="h-px flex-1 bg-white/20 max-w-[80px]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                  Ingredients
                </span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-3 leading-tight max-w-md">
                {t('card1Title')}
              </h3>
              <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-lg">
                {t('card1Desc')}
              </p>
            </div>
          </motion.div>

          {/* Secondary feature card — col-span 5 */}
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
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="lg:col-span-5 group relative rounded-3xl bg-white p-8 md:p-10 shadow-soft hover:shadow-cardHover transition-all duration-500 border border-slate-100 flex flex-col">
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-slate-900 text-slate-700 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                <ArrowUpRight className="w-4 h-4 rtl:rotate-90" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif text-4xl font-bold text-slate-300 leading-none">
                02
              </span>
              <div className="h-px flex-1 bg-slate-200 max-w-[60px]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Trust
              </span>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
              {t('card2Title')}
            </h3>
            <p className="text-slate-600 leading-relaxed flex-grow">
              {t('card2Desc')}
            </p>
          </motion.div>

          {/* Stat card — col-span 3 */}
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
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="lg:col-span-3 rounded-3xl bg-slate-900 text-white p-8 md:p-9 flex flex-col justify-between shadow-card relative overflow-hidden">
            
            {/* Decorative corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-teal-500/20 blur-2xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-terra flex items-center justify-center mb-6">
                <Award className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="font-serif text-5xl md:text-6xl font-bold text-white leading-none mb-2">
                100+
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                SKUs trusted by salons, pharmacies & wholesale partners across
                the GCC
              </p>
            </div>
          </motion.div>

          {/* Quote / Promise card — col-span 2 */}
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
              once: true,
              margin: '-50px'
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="lg:col-span-2 rounded-3xl bg-terra-soft p-8 md:p-9 flex flex-col justify-between border border-terra/20">
            
            <span className="font-serif text-6xl text-terra-deep leading-none">
              "
            </span>
            <p className="font-serif text-base md:text-lg italic text-slate-800 leading-snug">
              Quality you can feel, results you can see.
            </p>
            <div className="text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase">
              — The Promise
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}