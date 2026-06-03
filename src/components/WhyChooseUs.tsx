import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Leaf, Heart, ArrowRight } from 'lucide-react';
import { useTranslations } from '../lib/i18n';
export function WhyChooseUs() {
  const t = useTranslations('WhyChooseUs');
  const features = [
  {
    titleKey: 'card1Title',
    descKey: 'card1Desc',
    icon: Droplets,
    stat: '98%',
    statLabel: 'Customer satisfaction',
    image:
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Anti-acne skincare formulation'
  },
  {
    titleKey: 'card2Title',
    descKey: 'card2Desc',
    icon: Leaf,
    stat: '12+',
    statLabel: 'Natural extracts per blend',
    image:
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Botanical hair care ingredients'
  },
  {
    titleKey: 'card3Title',
    descKey: 'card3Desc',
    icon: Heart,
    stat: '50+',
    statLabel: 'Products across categories',
    image:
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Complete skin and body care collection'
  }] as
  const;
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-terra-soft/30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section header */}
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
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
          
          <span className="inline-block text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase mb-4">
            What makes us different
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.1]">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        {/* Alternating storytelling rows */}
        <div className="space-y-24 md:space-y-32">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                
                {/* Image side */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: isReversed ? 60 : -60
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0
                  }}
                  viewport={{
                    once: true,
                    margin: '-100px'
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="w-full lg:w-1/2 relative">
                  
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card">
                    <img
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                  </div>

                  {/* Floating stat card */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      y: 20
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      y: 0
                    }}
                    viewport={{
                      once: true
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3
                    }}
                    className={`absolute ${isReversed ? '-left-4 md:-left-8 rtl:-left-auto rtl:-right-4 rtl:md:-right-8' : '-right-4 md:-right-8 rtl:-right-auto rtl:-left-4 rtl:md:-left-8'} bottom-8 md:bottom-12 bg-white rounded-2xl shadow-cardHover p-5 md:p-6 min-w-[180px] border border-slate-100`}>
                    
                    <div className="font-serif text-4xl md:text-5xl font-bold text-teal-500 leading-none mb-2">
                      {feature.stat}
                    </div>
                    <div className="text-xs font-medium text-slate-600 leading-snug">
                      {feature.statLabel}
                    </div>
                  </motion.div>

                  {/* Step number watermark */}
                  <div
                    className={`hidden lg:block absolute top-0 ${isReversed ? '-right-6 rtl:-right-auto rtl:-left-6' : '-left-6 rtl:-left-auto rtl:-right-6'} font-serif text-[120px] font-bold text-slate-100 leading-none select-none pointer-events-none -translate-y-4`}>
                    
                    0{index + 1}
                  </div>
                </motion.div>

                {/* Content side */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: isReversed ? -60 : 60
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0
                  }}
                  viewport={{
                    once: true,
                    margin: '-100px'
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1
                  }}
                  className="w-full lg:w-1/2">
                  
                  {/* Icon chip */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mb-6 shadow-soft">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>

                  {/* Eyebrow */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                      0{index + 1} / 0{features.length}
                    </span>
                    <div className="h-px flex-1 bg-slate-200 max-w-[80px]" />
                  </div>

                  {/* Headline */}
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.15]">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">
                    {t(feature.descKey)}
                  </p>

                  {/* Learn more link */}
                  <a
                    href="#products"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-teal-600 transition-colors">
                    
                    <span className="border-b border-slate-300 group-hover:border-teal-600 pb-1 transition-colors">
                      Learn more
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}