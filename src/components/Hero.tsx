 import { motion } from 'framer-motion';
import { ShieldCheck, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from '../lib/i18n';
export function Hero() {
  const t = useTranslations('Hero');
  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center bg-saudi-sand">
      
      {/* Subtle Najdi-inspired geometric pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B1F3A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2 mb-6 border-b border-saudi-champagne pb-2">
              <Sparkles className="w-4 h-4 text-saudi-champagne" />
              <span className="text-xs font-semibold tracking-widest text-saudi-champagne uppercase">
                {t('eyebrow')}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-saudi-midnight leading-tight mb-8">
              {t('titleLine1')} <br />
              <span className="text-saudi-champagne">{t('titleLine2')}</span>
            </h1>

            <p className="text-xl text-saudi-ink mb-6 font-medium leading-relaxed">
              {t('subtitle')}
            </p>
            <p className="text-base text-saudi-ink/80 mb-10 leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              {t('description')}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <a
                href="#products"
                className="px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm flex items-center gap-2 border border-saudi-champagne">
                
                {t('ctaExplore')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
              <a
                href="#agents"
                className="px-8 py-4 bg-transparent text-saudi-midnight font-semibold border border-saudi-midnight hover:bg-saudi-midnight hover:text-saudi-champagne transition-colors uppercase tracking-wider text-sm">
                
                {t('ctaAgent')}
              </a>
            </div>

            <div className="flex flex-wrap gap-8 items-center border-t border-saudi-champagne/20 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-saudi-champagne/40 flex items-center justify-center bg-saudi-sand-deep">
                  <Star className="w-5 h-5 text-saudi-champagne" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-saudi-midnight leading-none mb-1">
                    {t('stat1Value')}
                  </p>
                  <p className="text-xs text-saudi-ink/70 uppercase tracking-widest">
                    {t('stat1Label')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-saudi-champagne/40 flex items-center justify-center bg-saudi-sand-deep">
                  <ShieldCheck className="w-5 h-5 text-saudi-champagne" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-saudi-midnight leading-none mb-1">
                    {t('stat2Value')}
                  </p>
                  <p className="text-xs text-saudi-ink/70 uppercase tracking-widest">
                    {t('stat2Label')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-saudi-champagne/40 flex items-center justify-center bg-saudi-sand-deep">
                  <Sparkles className="w-5 h-5 text-saudi-champagne" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-saudi-midnight leading-none mb-1">
                    {t('stat3Value')}
                  </p>
                  <p className="text-xs text-saudi-ink/70 uppercase tracking-widest">
                    {t('stat3Label')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative h-[700px] hidden lg:block">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
                delay: 0.2
              }}
              className="absolute inset-0 z-20 p-4">
              
              <div className="w-full h-full border border-saudi-champagne/30 p-2 relative bg-saudi-sand-deep">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-saudi-champagne"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-saudi-champagne"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-saudi-champagne"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-saudi-champagne"></div>

                <img
                  src="./images/care/baner.jpeg"
                  alt="Beautiful healthy hair & glowing skin model"
                  className="w-full h-full object-cover  x" />
                
              </div>
            </motion.div>

            {/* Decorative offset block */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
                delay: 0.4
              }}
              className="absolute top-20 -right-10 w-full h-full bg-saudi-midnight z-10">
            </motion.div>
          </div>
        </div>
      </div>
    </section>);

}