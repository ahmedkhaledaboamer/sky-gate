import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products, type Product } from '../data/products';
import { ProductModal } from './ProductModal';
import { useLocale, useTranslations } from '../lib/i18n';
export function Products() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Product | null>(null);
  const t = useTranslations('Products');
  const locale = useLocale();
  const featured = products.filter((p) => p.featured);
  return (
    <section id="products" className="py-24 relative z-10 bg-saudi-sand">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase mb-4">
              {t('eyebrow')}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('description')}
            </p>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-900 font-medium text-sm hover:border-teal-500 hover:text-teal-600 transition-all shadow-soft hover:shadow-card shrink-0">
            
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* Editorial Tile Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {featured.map((product, index) =>
          <motion.button
            key={product.id}
            type="button"
            onClick={() => setSelected(product)}
            initial={{
              opacity: 0,
              y: 24
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
              delay: index * 0.08,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{
              y: -6
            }}
            className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover transition-shadow duration-500 text-left">
            
              {/* Image Area (60% top) */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                <img
                src={product.image}
                alt={product.name[locale]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              

                {/* Category Eyebrow Chip */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-semibold tracking-widest text-slate-700 uppercase shadow-soft">
                    {product.category}
                  </span>
                </div>

                {/* Quick action icon - top right */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-soft">
                  <ArrowUpRight className="w-4 h-4 rtl:rotate-90" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-6">
                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors duration-300">
                  {product.name[locale]}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                  {product.shortDescription[locale]}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                    {t('moreDetails')}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>
              </div>
            </motion.button>
          )}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden text-center">
          <button
            onClick={() => navigate('/products')}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-900 font-medium text-sm hover:border-teal-500 hover:text-teal-600 transition-all shadow-soft">
            
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>);

}