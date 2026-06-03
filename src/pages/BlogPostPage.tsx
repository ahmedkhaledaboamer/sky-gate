import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, User } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useLocale, useTranslations } from '../lib/i18n';
export function BlogPostPage() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const t = useTranslations('BlogPost');
  const locale = useLocale();
  const post = blogPosts.find((p) => p.slug === slug);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [slug]);
  if (!post) {
    return (
      <main className="pt-40 pb-24 min-h-screen bg-saudi-sand flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-2xl">
          <h1 className="font-serif text-5xl font-bold text-saudi-midnight mb-6">
            {t('notFoundTitle')}
          </h1>
          <p className="text-saudi-ink/70 mb-10 font-light text-lg">
            {t('notFoundDesc')}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold text-sm uppercase tracking-wider hover:bg-saudi-ink transition-colors">
            
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            {t('backToBlog')}
          </Link>
        </div>
      </main>);

  }
  const related = blogPosts.
  filter((p) => p.id !== post.id && p.category === post.category).
  slice(0, 2);
  const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(iso));
  return (
    <main className="pt-32 pb-24 bg-saudi-sand min-h-screen">
      <article>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saudi-ink/60 hover:text-saudi-champagne mb-12 transition-colors">
              
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('back')}
            </button>

            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-saudi-midnight text-saudi-champagne text-xs font-bold uppercase tracking-widest mb-8">
                {post.category}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-saudi-midnight leading-tight mb-8">
                {post.title[locale]}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-saudi-ink/70 mb-12 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-saudi-champagne" />
                  <span className="text-saudi-midnight">
                    {post.author.name[locale]}
                  </span>
                  <span className="text-saudi-ink/40">
                    • {post.author.role[locale]}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-saudi-champagne" />{' '}
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-saudi-champagne" />{' '}
                  {post.readMinutes} {t('minRead')}
                </span>
              </div>
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="rounded-xl overflow-hidden shadow-2xl aspect-[16/9] max-w-5xl mx-auto border border-saudi-champagne/20">
              
              <img
                src={post.image}
                alt={post.title[locale]}
                className="w-full h-full object-cover" />
              
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 md:px-12 mt-20">
          <div className="max-w-3xl mx-auto">
            {post.content.map((para, idx) =>
            <p
              key={idx}
              className="text-lg md:text-xl text-saudi-ink/80 leading-relaxed mb-8 font-light">
              
                {para[locale]}
              </p>
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 &&
        <section className="container mx-auto px-6 md:px-12 mt-32 border-t border-saudi-champagne/20 pt-20">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-saudi-midnight">
                  {t('related')}
                </h2>
                <div className="flex-1 h-[1px] bg-saudi-champagne/20" />
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                {related.map((r) =>
              <button
                key={r.id}
                onClick={() => navigate(`/blog/${r.slug}`)}
                className="group bg-saudi-sand-deep rounded-xl overflow-hidden border border-saudi-champagne/10 hover:border-saudi-champagne/50 transition-all duration-500 text-start flex flex-col">
                
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                    src={r.image}
                    alt={r.title[locale]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                      <div className="absolute inset-0 bg-saudi-midnight/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="p-8">
                      <h3 className="font-serif text-2xl font-bold text-saudi-midnight mb-4 line-clamp-2 leading-snug">
                        {r.title[locale]}
                      </h3>
                      <p className="text-saudi-ink/70 text-sm line-clamp-2 font-light leading-relaxed mb-6">
                        {r.excerpt[locale]}
                      </p>
                      <span className="flex items-center gap-2 text-saudi-midnight font-semibold text-sm group/btn self-start hover:text-saudi-champagne transition-colors uppercase tracking-wider">
                        {t('readMore')}
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform rtl:rotate-90" />
                      </span>
                    </div>
                  </button>
              )}
              </div>
            </div>
          </section>
        }
      </article>
    </main>);

}