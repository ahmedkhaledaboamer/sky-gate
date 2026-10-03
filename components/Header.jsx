'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LogIn, Menu, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCartCount } from '@/context/CartContext';
import { useWishlistCount } from '@/context/WishlistContext';
import { useTranslations } from '@/lib/i18n';
import { scrollToSection } from '@/lib/scrollToSection';
import { LocaleSwitcher } from './LocaleSwitcher';
import { AccountMenu, accountLinks } from './store/AccountMenu';

const linkDefs = [
  { key: 'home', to: '/', hash: 'home' },
  { key: 'products', to: '/products' },
  { key: 'categories', to: '/categories' },
  { key: 'brands', to: '/brands' },
  { key: 'blog', to: '/blog' },
  { key: 'contact', to: '/', hash: 'contact' },
];

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-terra-deep text-white text-[10px] font-bold flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function IconLink({ href, label, count, children }) {
  return (
    <Link
      href={href}
      aria-label={count ? `${label} (${count})` : label}
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-saudi-midnight hover:bg-white hover:text-teal-600 transition-colors"
    >
      {children}
      <CountBadge count={count} />
    </Link>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Header');
  const { isAuthenticated, isCustomer, isReady, user, role, logout } = useAuth();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  // Section to scroll to once a navigation back to the home page has committed.
  const pendingHash = useRef(null);
  useEffect(() => {
    if (pathname === '/' && pendingHash.current) {
      scrollToSection(pendingHash.current);
      pendingHash.current = null;
    }
  }, [pathname]);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleLinkClick = (link) => {
    setMobileMenuOpen(false);
    if (link.hash) {
      if (pathname !== '/') {
        pendingHash.current = link.hash;
        router.push('/', { scroll: false });
      } else {
        scrollToSection(link.hash);
      }
    } else {
      pendingHash.current = null;
      router.push(link.to);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  const isActive = (link) =>
    !link.hash && link.to !== '/' && pathname?.startsWith(link.to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen ? 'bg-saudi-sand/90 backdrop-blur-md shadow-sm py-3 border-b border-saudi-champagne/20' : 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Image
            src="/images/logo2.png"
            alt={t('logoAlt')}
            className="w-20 sm:w-24"
            width={587}
            height={425}
            sizes="96px"
            preload
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {linkDefs.map((link) => (
            <button
              key={link.key}
              onClick={() => handleLinkClick(link)}
              aria-current={isActive(link) ? 'page' : undefined}
              className={`text-sm font-medium hover:text-saudi-champagne transition-colors relative group uppercase tracking-wider ${isActive(link) ? 'text-saudi-champagne' : 'text-saudi-ink'}`}
            >
              {t(link.key)}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-saudi-champagne transition-all duration-300 group-hover:w-full ${isActive(link) ? 'w-full' : 'w-0'}`}
              ></span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block me-1">
            <LocaleSwitcher />
          </div>

          {/* Wishlist & cart are customer features; guests are sent to login */}
          {(!isAuthenticated || isCustomer) && (
            <>
              <span className="hidden sm:contents">
                <IconLink href="/wishlist" label={t('wishlist')} count={wishlistCount}>
                  <Heart className="w-5 h-5" />
                </IconLink>
              </span>
              <IconLink href="/cart" label={t('cart')} count={cartCount}>
                <ShoppingBag className="w-5 h-5" />
              </IconLink>
            </>
          )}

          {isReady && isAuthenticated ? (
            <AccountMenu user={user} role={role} onLogout={() => logout('/')} />
          ) : (
            <Link
              href={`/login${pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''}`}
              className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-teal-500 transition-colors"
            >
              <LogIn className="w-4 h-4 rtl:rotate-180" />
              {t('login')}
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-saudi-midnight"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('toggleMenu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="absolute top-full left-0 right-0 bg-saudi-sand/95 backdrop-blur-lg shadow-lg border-t border-saudi-champagne/20 py-6 px-6 lg:hidden flex flex-col gap-4 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {linkDefs.map((link, i) => (
              <motion.button
                key={link.key}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                onClick={() => handleLinkClick(link)}
                className="text-start text-lg font-medium text-saudi-ink hover:text-saudi-champagne uppercase tracking-wider"
              >
                {t(link.key)}
              </motion.button>
            ))}

            <div className="border-t border-saudi-champagne/20 pt-4 flex flex-col gap-3">
              {isReady && isAuthenticated ? (
                <>
                  {accountLinks(role).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-base font-medium text-saudi-ink hover:text-saudi-champagne"
                    >
                      <item.icon className="w-5 h-5" />
                      {t(item.key)}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout('/');
                    }}
                    className="text-start text-base font-medium text-red-600"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-slate-900 text-white text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4 rtl:rotate-180" />
                  {t('login')}
                </Link>
              )}
              <div className="sm:hidden pt-2">
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
