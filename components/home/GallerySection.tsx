'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useGallery } from '@/context/GalleryContext';
import { WHATSAPP_NUMBER } from '@/data/products';
import DataUrlImg from '@/components/ui/DataUrlImg';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

function isDataUrl(src: string) { return src.startsWith('data:'); }

export default function GallerySection() {
  const { t, lang } = useLang();
  const { items, categories } = useGallery();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => { setLightbox(null); }, [activeCategory]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const waBase = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`;

  const filtered = activeCategory === 'all'
    ? items
    : items.filter(i => i.category === activeCategory);

  const waMsg = (id: string) =>
    `${waBase}?text=${encodeURIComponent(lang === 'ar'
      ? `مرحباً، أود الاستفسار عن القطعة ${id} في المعرض`
      : `Hello, I'm interested in gallery piece ${id}`)}`;

  const goNext = useCallback(() => {
    setLightbox(p => p !== null ? (p + 1) % filtered.length : 0);
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setLightbox(p => p !== null ? (p - 1 + filtered.length) % filtered.length : 0);
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowRight') lang === 'ar' ? goPrev() : goNext();
      else if (e.key === 'ArrowLeft') lang === 'ar' ? goNext() : goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, lang, goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        // Swiped left
        lang === 'ar' ? goPrev() : goNext();
      } else {
        // Swiped right
        lang === 'ar' ? goNext() : goPrev();
      }
    }
  };

  return (
    <section className="section-padding bg-cream dark:bg-[#1A1714]">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl text-charcoal dark:text-white mb-3"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}>
            {t('gallery.title')}
          </h2>
          <p className="text-ink/50 dark:text-white/40 text-base" style={{ fontFamily: font }}>
            {t('gallery.subtitle')}
          </p>
          <div className="w-12 h-px bg-[#C4956A] mx-auto mt-5" />
        </motion.div>

        {/* Filter tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-[#C4956A] text-white'
                  : 'bg-black/5 dark:bg-white/5 text-ink/60 dark:text-white/50 hover:bg-[#C4956A]/20 hover:text-[#C4956A]'
              }`}
              style={{ fontFamily: font }}
            >
              {lang === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.key
                    ? 'bg-[#C4956A] text-white'
                    : 'bg-black/5 dark:bg-white/5 text-ink/60 dark:text-white/50 hover:bg-[#C4956A]/20 hover:text-[#C4956A]'
                }`}
                style={{ fontFamily: font }}
              >
                {lang === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        )}

        {/* Grid — 2 cols mobile, 3 tablet, 4 desktop */}
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4"
        >
          {filtered.map((item, i) => (
            <motion.div key={item.id} variants={fadeUp}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-stone cursor-pointer"
              whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
              role="button" tabIndex={0}
              onClick={() => setLightbox(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightbox(i); }}
            >
              {isDataUrl(item.src) ? (
                <DataUrlImg src={item.src} alt={`Massqool gallery ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              ) : (
                <Image src={item.src} alt={`Massqool gallery ${i + 1}`} fill
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              )}

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent group-hover:from-black/30 transition-all duration-300" />

              {/* Sold badge */}
              {item.isSold && (
                <div className="absolute top-2 start-2 bg-black/60 backdrop-blur-sm text-white text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm" style={{ fontFamily: font }}>
                  {lang === 'ar' ? 'تم البيع' : 'Sold'}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox — fullscreen portrait */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
              <span className="text-white/40 text-xs" style={{ fontFamily: font }}>
                {lightbox + 1} / {filtered.length}
              </span>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/50 hover:text-white p-1 transition-colors"
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Image area */}
            <div className="flex-1 relative flex items-center justify-center px-4 min-h-0">
              {/* Desktop arrows */}
              <button
                onClick={goPrev}
                className="hidden md:flex absolute start-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 p-2 z-10 text-2xl transition-colors"
              >
                {lang === 'ar' ? '›' : '‹'}
              </button>

              <motion.div
                key={lightbox}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full max-w-md mx-auto"
              >
                {isDataUrl(filtered[lightbox].src) ? (
                  <DataUrlImg src={filtered[lightbox].src} alt="Gallery"
                    className="w-full h-full object-contain" />
                ) : (
                  <Image src={filtered[lightbox].src} alt="Gallery" fill sizes="100vw" className="object-contain" />
                )}
              </motion.div>

              <button
                onClick={goNext}
                className="hidden md:flex absolute end-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 p-2 z-10 text-2xl transition-colors"
              >
                {lang === 'ar' ? '‹' : '›'}
              </button>
            </div>

            {/* Dots */}
            {filtered.length > 1 && (
              <div className="flex justify-center gap-1.5 py-3 flex-shrink-0">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className={`transition-all duration-200 rounded-full ${
                      i === lightbox
                        ? 'w-4 h-1.5 bg-[#C4956A]'
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex justify-center px-5 pb-6 flex-shrink-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
              {filtered[lightbox].isSold ? (
                <a
                  href={waMsg(filtered[lightbox].id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 text-white/30 text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 hover:border-white/30 hover:text-white/50"
                  style={{ fontFamily: font }}
                >
                  {lang === 'ar' ? 'تواصل معنا لقطعة مشابهة' : 'Contact us for a similar piece'}
                </a>
              ) : (
                <a
                  href={waMsg(filtered[lightbox].id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 text-white/70 text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 hover:border-white/50 hover:text-white"
                  style={{ fontFamily: font }}
                >
                  {lang === 'ar' ? 'استفسر عن هذه القطعة' : 'Inquire about this piece'}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
