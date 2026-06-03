import React, { useState } from 'react';
import {
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight } from
'lucide-react';
import { useTranslations } from '../lib/i18n';
import { sendToEmail } from '../lib/sendToEmail';
export function Footer() {
  const tFooter = useTranslations('Footer');
  const tHeader = useTranslations('Header');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const quickLinks: Array<
    'home' | 'products' | 'about' | 'agents' | 'blog' | 'contact'> =
  ['home', 'products', 'about', 'agents', 'blog', 'contact'];
  const categoryKeys = [
  'catHairOils',
  'catShampoo',
  'catSunscreen',
  'catSkin',
  'catAcne'] as
  const;
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    sendToEmail({
      subject: 'Newsletter Subscription',
      fields: {
        Email: newsletterEmail,
        Source: 'Footer newsletter signup'
      }
    });
    setNewsletterEmail('');
  };
  return (
    <footer className="bg-saudi-midnight text-saudi-sand pt-20 pb-10 border-t border-saudi-champagne/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-saudi-champagne" />
              <span className="font-serif text-3xl font-semibold tracking-wide text-saudi-sand">
                Dream & Shine
              </span>
            </div>
            <p className="text-saudi-sand/70 mb-6 leading-relaxed">
              {tFooter('tagline')}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-saudi-champagne/30 flex items-center justify-center hover:bg-saudi-champagne hover:text-saudi-midnight transition-colors text-saudi-champagne">
                
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-saudi-champagne/30 flex items-center justify-center hover:bg-saudi-champagne hover:text-saudi-midnight transition-colors text-saudi-champagne">
                
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full border border-saudi-champagne/30 flex items-center justify-center hover:bg-saudi-champagne hover:text-saudi-midnight transition-colors text-saudi-champagne">
                
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-semibold mb-6 text-saudi-champagne">
              {tFooter('quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((key) =>
              <li key={key}>
                  <a
                  href={
                  key === 'products' ?
                  '/products' :
                  key === 'blog' ?
                  '/blog' :
                  `#${key}`
                  }
                  className="text-saudi-sand/70 hover:text-saudi-champagne transition-colors">
                  
                    {tHeader(key)}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-semibold mb-6 text-saudi-champagne">
              {tFooter('categories')}
            </h4>
            <ul className="space-y-3">
              {categoryKeys.map((key) =>
              <li key={key}>
                  <a
                  href="/products"
                  className="text-saudi-sand/70 hover:text-saudi-champagne transition-colors">
                  
                    {tFooter(key)}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-semibold mb-6 text-saudi-champagne">
              {tFooter('stayUpdated')}
            </h4>
            <p className="text-saudi-sand/70 mb-4">{tFooter('newsletter')}</p>
            <form className="flex gap-2 mb-8" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={tFooter('emailPh')}
                className="bg-saudi-ink border border-saudi-champagne/30 rounded-none px-4 py-2 w-full focus:outline-none focus:border-saudi-champagne text-saudi-sand placeholder-saudi-sand/50" />
              
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-saudi-champagne hover:bg-saudi-champagne-light text-saudi-midnight rounded-none px-4 py-2 transition-colors flex items-center justify-center">
                
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </form>
            <div className="space-y-2 text-sm text-saudi-sand/70">
              <p>Royal Care Trading Co.</p>
              <p>Riyadh, Saudi Arabia</p>
              <p dir="ltr">Email: royalcareuae@hotmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-saudi-champagne/20 pt-8 text-center text-saudi-sand/50 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{tFooter('copyright')}</p>
          <p className="text-saudi-champagne/70 uppercase tracking-widest text-xs">
            Riyadh • Jeddah • Dammam • Khobar • Makkah • Madinah
          </p>
        </div>
      </div>
    </footer>);

}