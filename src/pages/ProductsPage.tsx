import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  products,
  categories,
  type Product,
  type Category } from
'../data/products';
import { ProductModal } from '../components/ProductModal';
import { useLocale, useTranslations } from '../lib/i18n';
export function ProductsPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const t = useTranslations('ProductsPage');
  const locale = useLocale();
  const categoryLabel = (c: Category) => {
    switch (c) {
      case 'All':
        return t('categoryAll');
      case 'Hair Care':
        return t('categoryHair');
      case 'Skin Care':
        return t('categorySkin');
      case 'Sun Protection':
        return t('categorySun');
      case 'Anti Acne':
        return t('categoryAcne');
      case 'Body Care':
        return t('categoryBody');
    }
  };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
      q === '' ||
      p.name[locale].toLowerCase().includes(q) ||
      p.shortDescription[locale].toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, locale]);
  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <section className="relative overflow-hidden border-b border-saudi-champagne/20 pb-12">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-saudi-ink/70 mb-8">
            
            <Link
              to="/"
              className="hover:text-saudi-champagne transition-colors">
              
              {t('breadcrumbHome')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-saudi-midnight font-medium">
              {t('breadcrumbProducts')}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-bold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
              <div className="w-8 h-[1px] bg-saudi-champagne" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-saudi-midnight mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-saudi-ink/80 text-lg max-w-2xl font-light leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="mt-16 flex flex-col lg:flex-row gap-8 lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) =>
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-none text-sm font-medium border transition-all duration-300 ${category === cat ? 'bg-saudi-midnight text-saudi-champagne border-saudi-midnight' : 'bg-transparent text-saudi-midnight border-saudi-midnight/20 hover:border-saudi-champagne hover:text-saudi-champagne'}`}>
                
                  {categoryLabel(cat)}
                </button>
              )}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-saudi-ink/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full ps-11 pe-4 py-3 rounded-none border border-saudi-midnight/20 bg-transparent focus:outline-none focus:border-saudi-champagne focus:ring-1 focus:ring-saudi-champagne transition-all text-saudi-midnight placeholder:text-saudi-ink/50" />
              
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 mt-16">
        {filtered.length === 0 ?
        <div className="text-center py-32 border border-saudi-champagne/20 bg-saudi-sand-deep/50">
            <p className="text-saudi-ink/60 text-lg font-medium">
              {t('emptyState')}
            </p>
          </div> :

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product, index) =>
          <motion.div
            key={product.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index % 8 * 0.05,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="group bg-saudi-sand-deep rounded-xl p-5 border border-saudi-champagne/10 hover:border-saudi-champagne/50 transition-all duration-500 flex flex-col">
            
                <div
              className={`relative w-full aspect-square rounded-lg mb-6 overflow-hidden ${product.bg} flex items-center justify-center p-4`}>
              
                  <img
                src={product.image}
                alt={product.name[locale]}
                className="w-full h-full object-cover rounded-md shadow-sm group-hover:scale-105 transition-transform duration-700" />
              
                  <span className="absolute top-3 start-3 px-3 py-1 bg-saudi-midnight text-saudi-champagne text-[10px] font-bold tracking-widest uppercase">
                    {categoryLabel(product.category)}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-saudi-midnight mb-3 leading-snug">
                  {product.name[locale]}
                </h3>
                <p className="text-saudi-ink/70 text-sm mb-6 line-clamp-3 flex-1 font-light leading-relaxed">
                  {product.shortDescription[locale]}
                </p>
                <button
              onClick={() => setSelected(product)}
              className="flex items-center gap-2 text-saudi-midnight font-semibold text-sm group/btn self-start hover:text-saudi-champagne transition-colors uppercase tracking-wider">
              
                  {t('moreDetails')}
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform rtl:rotate-90" />
                </button>
              </motion.div>
          )}
          </div>
        }
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </main>);

}