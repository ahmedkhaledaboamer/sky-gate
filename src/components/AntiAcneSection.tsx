import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Droplets,
  Sparkles,
  ArrowRight,
  CheckCircle2 } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products, type Product } from '../data/products';
import { ProductModal } from './ProductModal';
import { useLocale, useTranslations } from '../lib/i18n';
export function AntiAcneSection() {
  const navigate = useNavigate();
  const t = useTranslations('AntiAcne');
  const locale = useLocale();
  const [selected, setSelected] = useState<Product | null>(null);
  // Filter the 4 anti-acne products
  const acneProducts = products.filter((p) => p.category === 'Anti Acne');
  // Map products to steps based on ID
  const getStepNumber = (id: string) => {
    if (id.includes('face-wash')) return 1;
    if (id.includes('soap')) return 2;
    if (id.includes('gel')) return 3;
    if (id.includes('body-spray')) return 4;
    return 1;
  };
  // Sort products by step
  const sortedProducts = [...acneProducts].sort(
    (a, b) => getStepNumber(a.id) - getStepNumber(b.id)
  );
  const faceWash = acneProducts.find((p) => p.id.includes('face-wash'));
  const steps = [
  {
    title: t('step1Title'),
    desc: t('step1Desc'),
    icon: Droplets
  },
  {
    title: t('step2Title'),
    desc: t('step2Desc'),
    icon: Shield
  },
  {
    title: t('step3Title'),
    desc: t('step3Desc'),
    icon: Sparkles
  },
  {
    title: t('step4Title'),
    desc: t('step4Desc'),
    icon: CheckCircle2
  }];

  return (
    <section className="py-24 relative overflow-hidden bg-saudi-sand border-t border-saudi-champagne/20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header & Routine Section */}
        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Left Column: Text & Steps */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-6 border-b border-saudi-champagne pb-2 self-start">
              <Shield className="w-4 h-4 text-saudi-champagne" />
              <span className="text-xs font-semibold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight mb-8 leading-tight">
              {t('titleLine1')} <br />
              <span className="text-saudi-champagne italic">
                {t('titleLine2')}
              </span>
            </h2>
            <p className="text-saudi-ink/80 text-lg mb-12 max-w-xl leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              {t('description')}
            </p>

            {/* 4-Step Routine List */}
            <div className="space-y-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{
                      opacity: 0,
                      x: -20
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0
                    }}
                    viewport={{
                      once: true
                    }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.5,
                      ease: 'easeOut'
                    }}
                    className="flex items-start gap-6">
                    
                    <div className="w-14 h-14 border border-saudi-champagne/40 bg-saudi-sand-deep flex items-center justify-center shrink-0 text-saudi-champagne">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-serif text-2xl font-bold text-saudi-midnight mb-2">
                        {step.title}
                      </h4>
                      <p className="text-saudi-ink/70 text-sm">{step.desc}</p>
                    </div>
                  </motion.div>);

              })}
            </div>
          </div>

          {/* Right Column: Featured Hero Card */}
          <div className="lg:w-1/2 flex justify-center items-center">
            {faceWash &&
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
                duration: 0.7,
                ease: 'easeOut'
              }}
              className="relative w-full max-w-md">
              
                <div className="relative bg-saudi-midnight p-8 border border-saudi-champagne">
                  <div className="absolute top-0 right-0 bg-saudi-champagne text-saudi-midnight text-xs font-bold px-4 py-2 uppercase tracking-widest">
                    {t('stepBadge')} 01
                  </div>

                  <div className="aspect-square mb-8 bg-saudi-ink flex items-center justify-center p-6 relative group border border-saudi-champagne/20 mt-6">
                    <img
                    src={faceWash.image}
                    alt={faceWash.name[locale]}
                    className="w-full h-full object-cover  " />
                  
                  </div>

                  <h3 className="font-serif text-3xl font-bold text-saudi-sand mb-4 text-center">
                    {faceWash.name[locale]}
                  </h3>
                  <p className="text-saudi-sand/70 text-center mb-8 text-sm">
                    {faceWash.shortDescription[locale]}
                  </p>

                  <button
                  onClick={() => setSelected(faceWash)}
                  className="w-full py-4 bg-transparent border border-saudi-champagne text-saudi-champagne font-semibold hover:bg-saudi-champagne hover:text-saudi-midnight transition-colors duration-300 flex items-center justify-center gap-2 uppercase tracking-wider text-sm">
                  
                    {t('learnMore')}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </motion.div>
            }
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sortedProducts.map((product, index) => {
            const stepNum = getStepNumber(product.id);
            return (
              <motion.div
                key={product.id}
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
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: 'easeOut'
                }}
                onClick={() => setSelected(product)}
                className="group cursor-pointer bg-saudi-sand-deep p-6 border border-saudi-champagne/20 hover:border-saudi-champagne transition-colors duration-300 flex flex-col h-full">
                
                <div className="flex justify-between items-center mb-6 border-b border-saudi-champagne/20 pb-4">
                  <span className="text-saudi-champagne text-xs font-bold uppercase tracking-widest">
                    {t('stepBadge')} 0{stepNum}
                  </span>
                  <Shield className="w-4 h-4 text-saudi-champagne/40 group-hover:text-saudi-champagne transition-colors" />
                </div>

                <div className="relative w-full aspect-square mb-6 overflow-hidden bg-saudi-sand flex items-center justify-center p-4 border border-saudi-champagne/10">
                  <img
                    src={product.image}
                    alt={product.name[locale]}
                    className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-500" />
                  
                </div>

                <h3 className="font-serif text-xl font-bold text-saudi-midnight mb-3">
                  {product.name[locale]}
                </h3>
                <p className="text-saudi-ink/70 text-sm mb-6 line-clamp-2 flex-grow">
                  {product.shortDescription[locale]}
                </p>

                <div className="flex items-center gap-2 text-saudi-champagne font-semibold text-sm uppercase tracking-wider mt-auto">
                  {t('learnMore')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
                </div>
              </motion.div>);

          })}
        </div>

        {/* CTA */}
        <div className="text-center border-t border-saudi-champagne/20 pt-12">
          <button
            onClick={() => navigate('/products?category=Anti%20Acne')}
            className="px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm inline-flex items-center gap-2">
            
            {t('cta')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>);

}