'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Sun, Moon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { WHATSAPP_NUMBER } from '@/data/products';

const NAV_LINKS = [
  { key: 'nav.home' as const, href: '/' },
  { key: 'nav.collections' as const, href: '/collections' },
  { key: 'nav.about' as const, href: '/about' },
  { key: 'nav.contact' as const, href: '/contact' },
];

export default function Navbar() {
  const { t, toggleLang, lang } = useLang();
  const { itemCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 overflow-visible ${
          scrolled ? 'bg-black/70 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
        }`}
        initial={{ y: -130 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-24 sm:h-32 md:h-44 flex items-center justify-between gap-3">
          {/* Nav links — left in RTL */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="luxury-underline text-sm font-medium transition-colors duration-300 text-white/80 hover:text-[#C4956A]"
                style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Logo — center */}
          <div className="flex-1 flex lg:flex-none justify-center lg:justify-start mt-4 sm:mt-6 md:mt-10">
            <div className="block sm:hidden"><Logo variant="light" size="sm" /></div>
            <div className="hidden sm:block md:hidden"><Logo variant="light" size="sm" /></div>
            <div className="hidden md:block"><Logo variant="light" size="md" /></div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* WhatsApp CTA */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 border border-white/40 text-white hover:bg-white/10"
              style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('nav.whatsapp')}
            </a>

            {/* Lang toggle */}
            <button
              onClick={toggleLang}
              className="text-sm font-medium px-2.5 py-1.5 rounded border transition-colors duration-300 border-white/40 text-white hover:border-[#C4956A] hover:text-[#C4956A]"
              aria-label="Toggle language"
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded transition-colors duration-300 text-white hover:text-[#C4956A]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 transition-colors duration-300 text-white hover:text-[#C4956A]"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-[10px] font-bold bg-wood-warm text-white rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 transition-colors duration-300 text-white hover:text-[#C4956A]"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} z-50 h-full w-72 bg-cream flex flex-col`}
            >
              <div className="flex items-center justify-between p-6 border-b border-stone">
                <Logo variant="dark" size="sm" />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-ink hover:text-wood-warm">
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-6 flex-1">
                {NAV_LINKS.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-xl font-semibold text-ink hover:text-wood-warm py-3 border-b border-stone/50 transition-colors duration-200"
                    style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
                  >
                    {t(key)}
                  </Link>
                ))}
              </div>
              <div className="p-6 border-t border-stone">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-full text-base"
                  style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('nav.whatsapp')}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

