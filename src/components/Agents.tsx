import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  TrendingUp,
  Package,
  Megaphone,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
} from 'lucide-react'
import { useLocale, useTranslations } from '../lib/i18n'
import { AgencyRequestModal } from './AgencyRequestModal'
interface Distributor {
  name: {
    en: string
    ar: string
  }
  region: {
    en: string
    ar: string
  }
  phones: string[]
  email?: string
  placeholder?: boolean
}
const distributors: Distributor[] = [
  {
    name: {
      en: 'Sahha Daima Pharmaceuticals Co.',
      ar: 'شركة الصحة الدائمة للأدوية',
    },
    region: {
      en: 'Western Region',
      ar: 'المنطقة الغربية',
    },
    phones: ['0500776820', '+966 56 138 1949'],
    email: 'sahhadaima@gmail.com',
  },
  {
    name: {
      en: 'New Distributor — Coming Soon',
      ar: 'موزّع جديد — قريباً',
    },
    region: {
      en: 'Central & Eastern Region',
      ar: 'المنطقة الوسطى والشرقية',
    },
    phones: [],
    placeholder: true,
  },
]
export function Agents() {
  const t = useTranslations('Agents')
  const locale = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  const benefits = [
    {
      icon: Briefcase,
      key: 'benefit1' as const,
    },
    {
      icon: Megaphone,
      key: 'benefit2' as const,
    },
    {
      icon: TrendingUp,
      key: 'benefit3' as const,
    },
    {
      icon: Package,
      key: 'benefit4' as const,
    },
  ]
  const directoryTitle =
    locale === 'ar' ? 'وكلاؤنا المعتمدون' : 'Our Authorized Distributors'
  const directorySubtitle =
    locale === 'ar'
      ? 'شبكة موزّعينا الرسميين المعتمدين في المملكة العربية السعودية.'
      : 'Our network of officially authorized distributors across Saudi Arabia.'
  const verifiedLabel = locale === 'ar' ? 'موزّع معتمد' : 'Authorized'
  const comingSoonLabel = locale === 'ar' ? 'قريباً' : 'Coming soon'
  return (
    <section
      id="agents"
      className="py-24 bg-saudi-sand-deep relative overflow-hidden border-t border-saudi-champagne/20"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Recruitment block */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className="relative"
          >
            <div className="border border-saudi-champagne p-2 bg-saudi-sand aspect-[4/3]">
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800"
                  alt="Business partnership and boutique"
                  className="w-full h-full object-cover filter contrast-125 saturate-50"
                />
                <div className="absolute inset-0 bg-saudi-midnight/10 mix-blend-multiply" />
              </div>
            </div>

            <div className="absolute -bottom-6 -end-6 bg-saudi-midnight p-6 border border-saudi-champagne max-w-[220px]">
              <p className="font-serif text-3xl font-bold text-saudi-champagne mb-2">
                {t('badge1')}
              </p>
              <p className="text-xs text-saudi-sand/80 font-medium uppercase tracking-widest leading-relaxed">
                {t('badge2')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-saudi-ink/80 text-lg mb-10 leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
              {t('description')}
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit) => (
                <div
                  key={benefit.key}
                  className="flex items-start gap-4 bg-saudi-sand p-5 border border-saudi-champagne/20"
                >
                  <div className="w-10 h-10 border border-saudi-champagne/40 bg-saudi-sand-deep flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-saudi-champagne" />
                  </div>
                  <p className="font-bold text-saudi-midnight mt-2 text-sm">
                    {t(benefit.key)}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-4 bg-saudi-midnight text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm inline-flex items-center gap-2"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </motion.div>
        </div>

        {/* Distributors directory */}
        <div className="mt-24">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase mb-4">
              <MapPin className="w-4 h-4" />
              {locale === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-saudi-midnight mb-3">
              {directoryTitle}
            </h3>
            <p className="text-saudi-ink/70 text-lg">{directorySubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {distributors.map((dist, index) => (
              <motion.div
                key={dist.name.en}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-50px',
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`rounded-3xl p-8 border transition-shadow duration-500 ${dist.placeholder ? 'bg-saudi-sand/60 border-dashed border-saudi-champagne/40' : 'bg-white border-slate-100 shadow-soft hover:shadow-card'}`}
              >
                {/* Region + status */}
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    {dist.region[locale]}
                  </span>
                  {dist.placeholder ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                      {comingSoonLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terra-soft text-terra-deep text-xs font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {verifiedLabel}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h4 className="font-serif text-2xl font-bold text-saudi-midnight mb-5 leading-tight">
                  {dist.name[locale]}
                </h4>

                {dist.placeholder ? (
                  <p className="text-saudi-ink/50 text-sm">
                    {locale === 'ar'
                      ? 'سيتم إضافة بيانات التواصل قريباً.'
                      : 'Contact details will be added soon.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dist.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        dir="ltr"
                        className="flex items-center gap-3 text-saudi-ink hover:text-teal-600 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center shrink-0 transition-colors">
                          <Phone className="w-4 h-4 text-teal-600" />
                        </span>
                        <span className="font-medium text-sm">{phone}</span>
                      </a>
                    ))}
                    {dist.email && (
                      <a
                        href={`mailto:${dist.email}`}
                        dir="ltr"
                        className="flex items-center gap-3 text-saudi-ink hover:text-teal-600 transition-colors group"
                      >
                        <span className="w-9 h-9 rounded-full bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center shrink-0 transition-colors">
                          <Mail className="w-4 h-4 text-teal-600" />
                        </span>
                        <span className="font-medium text-sm break-all">
                          {dist.email}
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AgencyRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  )
}
