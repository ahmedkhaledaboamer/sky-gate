import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Check, Send } from 'lucide-react';
import { useTranslations } from '../lib/i18n';
import { sendToEmail } from '../lib/sendToEmail';
interface ContactForm {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}
const empty: ContactForm = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  message: ''
};
export function ContactUs() {
  const t = useTranslations('Contact');
  const [form, setForm] = useState<ContactForm>(empty);
  const [submitted, setSubmitted] = useState(false);
  const handleChange =
  (field: keyof ContactForm) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  setForm((f) => ({
    ...f,
    [field]: e.target.value
  }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendToEmail({
      subject: `New Contact Request from ${form.fullName}`,
      fields: {
        Name: form.fullName,
        Company: form.company,
        Email: form.email,
        Phone: form.phone,
        Country: form.country,
        Message: form.message
      }
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(empty);
    }, 6000);
  };
  return (
    <section
      id="contact"
      className="py-24 bg-saudi-sand border-t border-saudi-champagne/20">
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
              once: true
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}>
            
            <div className="mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-saudi-midnight mb-6 leading-tight">
                {t('title')}
              </h2>
              <p className="text-saudi-ink/80 text-lg leading-relaxed border-l-2 border-saudi-champagne pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                {t('description')}
              </p>
            </div>

            {submitted ?
            <div className="border border-saudi-champagne bg-saudi-sand-deep p-10 text-center">
                <div className="w-16 h-16 border border-saudi-champagne flex items-center justify-center mx-auto mb-6 bg-saudi-sand">
                  <Check className="w-8 h-8 text-saudi-champagne" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-saudi-midnight mb-3">
                  {t('successTitle')}
                </h3>
                <p className="text-saudi-ink/80">{t('successDesc')}</p>
              </div> :

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-saudi-midnight mb-2 uppercase tracking-widest">
                      {t('fullName')}
                    </label>
                    <input
                    required
                    type="text"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/40 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40"
                    placeholder={t('fullNamePh')} />
                  
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-saudi-midnight mb-2 uppercase tracking-widest">
                      {t('company')}
                    </label>
                    <input
                    type="text"
                    value={form.company}
                    onChange={handleChange('company')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/40 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40"
                    placeholder={t('companyPh')} />
                  
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-saudi-midnight mb-2 uppercase tracking-widest">
                      {t('email')}
                    </label>
                    <input
                    required
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/40 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40"
                    placeholder={t('emailPh')} />
                  
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-saudi-midnight mb-2 uppercase tracking-widest">
                      {t('phone')}
                    </label>
                    <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="w-full px-4 py-3 rounded-none border border-saudi-champagne/40 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40"
                    placeholder={t('phonePh')} />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-saudi-midnight mb-2 uppercase tracking-widest">
                    {t('country')}
                  </label>
                  <input
                  type="text"
                  value={form.country}
                  onChange={handleChange('country')}
                  className="w-full px-4 py-3 rounded-none border border-saudi-champagne/40 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40"
                  placeholder={t('countryPh')} />
                
                </div>

                <div>
                  <label className="block text-xs font-bold text-saudi-midnight mb-2 uppercase tracking-widest">
                    {t('message')}
                  </label>
                  <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange('message')}
                  className="w-full px-4 py-3 rounded-none border border-saudi-champagne/40 focus:outline-none focus:ring-1 focus:ring-saudi-champagne focus:border-saudi-champagne transition-shadow bg-saudi-sand-deep/50 text-saudi-midnight placeholder-saudi-midnight/40 resize-none"
                  placeholder={t('messagePh')}>
                </textarea>
                </div>

                <button
                type="submit"
                className="w-full py-4 bg-saudi-midnight text-saudi-champagne font-semibold border border-saudi-champagne hover:bg-saudi-ink transition-colors uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2">
                
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  {t('submit')}
                </button>
              </form>
            }
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className="relative h-full min-h-[600px] border border-saudi-champagne p-2 bg-saudi-sand">
            
            <div className="w-full h-full relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"
                alt=""
                className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50" />
              
              <div className="absolute inset-0 bg-saudi-midnight/20 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-saudi-midnight via-saudi-midnight/40 to-transparent"></div>

              <div className="absolute bottom-8 start-8 end-8 bg-saudi-midnight/90 backdrop-blur-md p-8 border border-saudi-champagne/30">
                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 border border-saudi-champagne/40 bg-saudi-ink flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-saudi-champagne" />
                    </div>
                    <div>
                      <p className="font-bold text-saudi-sand mb-1 uppercase tracking-widest text-xs">
                        {t('hqLabel')}
                      </p>
                      <p className="text-sm text-saudi-sand/70">
                        {t('hqValue')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 border border-saudi-champagne/40 bg-saudi-ink flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-saudi-champagne" />
                    </div>
                    <div>
                      <p className="font-bold text-saudi-sand mb-1 uppercase tracking-widest text-xs">
                        {t('emailLabel')}
                      </p>
                      <p className="text-sm text-saudi-sand/70" dir="ltr">
                        royalcareuae@hotmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}