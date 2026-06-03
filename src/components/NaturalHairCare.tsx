import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Droplet, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products, type Product } from '../data/products';
import { ProductModal } from './ProductModal';
import { useLocale, useTranslations } from '../lib/i18n';
export function NaturalHairCare() {
  const navigate = useNavigate();
  const t = useTranslations('NaturalHairCare');
  const locale = useLocale();
  const [selected, setSelected] = useState<Product | null>(null);
  // Filter the 6 specific hair oils
  const hairOils = products.filter(
    (p) => p.category === 'Hair Care' && p.id.endsWith('-hair-oil')
  );
  return (
    <section className="py-24 relative overflow-hidden bg-saudi-midnight border-t border-saudi-champagne/20 text-saudi-sand">
      {/* Subtle Najdi-inspired geometric pattern background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start gap-16 mb-20">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 mb-6 border-b border-saudi-champagne pb-2">
              <Leaf className="w-4 h-4 text-saudi-champagne" />
              <span className="text-xs font-semibold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-saudi-sand mb-8 leading-tight">
              {t('titleLine1')} <br />
              <span className="text-saudi-champagne italic">
                {t('titleLine2')}
              </span>
            </h2>
            <p className="text-saudi-sand/80 text-lg mb-10 max-w-xl leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              {t('description')}
            </p>

            {/* Stat Strip */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm font-medium text-saudi-champagne uppercase tracking-wider text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-saudi-champagne/40 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                {t('stat1')}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-saudi-champagne/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                {t('stat2')}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-saudi-champagne/40 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                {t('stat3')}
              </div>
            </div>
          </div>

          {/* Decorative Illustration Area */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-md aspect-[4/3] border border-saudi-champagne p-2">
              <div className="w-full h-full bg-saudi-ink flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A961' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"
                  }}>
                </div>
                <Leaf
                  className="w-32 h-32 text-saudi-champagne opacity-50"
                  strokeWidth={1} />
                
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {hairOils.map((product, index) =>
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
              duration: 0.6,
              ease: 'easeOut'
            }}
            onClick={() => setSelected(product)}
            className="group cursor-pointer bg-saudi-ink p-6 border border-saudi-champagne/20 hover:border-saudi-champagne transition-colors duration-300 relative flex flex-col h-full">
            
              <div className="relative flex flex-col items-center text-center h-full">
                <div className="w-32 h-32 rounded-none overflow-hidden mb-6 border border-saudi-champagne/40 group-hover:border-saudi-champagne transition-colors duration-500 bg-saudi-sand p-2">
                  <img
                  src={product.image}
                  alt={product.name[locale]}
                  className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-500" />
                
                </div>

                <h3 className="font-serif text-2xl font-bold text-saudi-sand mb-3">
                  {product.name[locale]}
                </h3>
                <p className="text-saudi-sand/60 text-sm mb-6 line-clamp-2 flex-grow">
                  {product.shortDescription[locale]}
                </p>

                {/* Ingredient Chips */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {product.ingredients.slice(0, 3).map((ing, i) =>
                <span
                  key={i}
                  className="px-3 py-1 border border-saudi-champagne/30 text-saudi-champagne text-xs font-medium uppercase tracking-wider">
                  
                      {ing[locale]}
                    </span>
                )}
                </div>

                <div className="flex items-center gap-2 text-saudi-champagne font-semibold text-sm uppercase tracking-wider mt-auto">
                  {t('learnMore')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center border-t border-saudi-champagne/20 pt-12">
          <button
            onClick={() => navigate('/products?category=Hair%20Care')}
            className="px-8 py-4 bg-saudi-champagne text-saudi-midnight font-semibold hover:bg-saudi-champagne-light transition-colors uppercase tracking-wider text-sm inline-flex items-center gap-2">
            
            {t('cta')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>);

}