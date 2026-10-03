import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useLocale, useTranslations } from '../lib/i18n';
export function Blog() {
  const navigate = useNavigate();
  const t = useTranslations('Blog');
  const locale = useLocale();
  const featured = blogPosts.filter((p) => p.featured).slice(0, 3);
  const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(iso));
  return (
    <section
      id="blog"
      className="py-24 relative z-10 bg-saudi-sand border-t border-saudi-champagne/20">
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 border-b border-saudi-champagne pb-2">
              <Sparkles className="w-4 h-4 text-saudi-champagne" />
              <span className="text-xs font-semibold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight mb-4">
              {t('title')}
            </h2>
            <p className="text-saudi-ink/80 text-lg">{t('description')}</p>
          </div>

          <button
            onClick={() => navigate('/blog')}
            className="hidden md:flex px-8 py-3 bg-transparent text-saudi-midnight font-semibold border border-saudi-midnight hover:bg-saudi-midnight hover:text-saudi-champagne transition-colors uppercase tracking-wider text-sm items-center gap-2 shrink-0">
            
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featured.map((post, index) =>
          <motion.article
            key={post.id}
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
            className="group bg-saudi-sand-deep border border-saudi-champagne/20 hover:border-saudi-champagne transition-colors duration-300 flex flex-col h-full">
            
              <button
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="relative aspect-[16/10] overflow-hidden text-start block w-full border-b border-saudi-champagne/20">
              
                <img
                src={post.image}
                alt={post.title[locale]}
                className="w-full h-full object-cover " />
              
                <div className="absolute inset-0 bg-saudi-midnight/10 group-hover:bg-transparent transition-colors duration-500"></div>
                <span className="absolute top-4 start-4 px-3 py-1 bg-saudi-midnight text-saudi-champagne text-[10px] font-bold tracking-widest uppercase border border-saudi-champagne/30">
                  {post.category}
                </span>
              </button>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-saudi-ink/60 mb-4 uppercase tracking-wider font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-saudi-champagne" />{' '}
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-saudi-champagne" />{' '}
                    {post.readMinutes} {t('minRead')}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-saudi-midnight mb-3 line-clamp-2">
                  {post.title[locale]}
                </h3>
                <p className="text-saudi-ink/70 text-sm mb-6 line-clamp-3 flex-1">
                  {post.excerpt[locale]}
                </p>

                <button
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="flex items-center gap-2 text-saudi-champagne font-semibold text-sm uppercase tracking-wider mt-auto group/btn self-start">
                
                  {t('readMore')}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform rtl:rotate-180" />
                </button>
              </div>
            </motion.article>
          )}
        </div>

        <div className="md:hidden text-center">
          <button
            onClick={() => navigate('/blog')}
            className="w-full px-8 py-4 bg-transparent text-saudi-midnight font-semibold border border-saudi-midnight hover:bg-saudi-midnight hover:text-saudi-champagne transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>);

}