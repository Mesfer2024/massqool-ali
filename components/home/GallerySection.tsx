'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Eye, Loader2 } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useGallery } from '@/context/GalleryContext';
import { WHATSAPP_NUMBER } from '@/data/products';
import DataUrlImg from '@/components/ui/DataUrlImg';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

function isDataUrl(src: string) { return src.startsWith('data:'); }

async function shareToWhatsApp(src: string, waUrl: string, lang: 'ar' | 'en') {
  if (!src) { window.open(waUrl, '_blank'); return; }

  const text = lang === 'ar'
    ? 'مرحباً، أود الاستفسار عن هذه القطعة من معرض مصقول'
    : 'Hello, I am interested in this piece from Massqool gallery';

  // Try native share with image (works on mobile)
  // Note: some WhatsApp versions ignore `text` when files are present — fallback covers this
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const blob = await res.blob();
      const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
      const file = new File([blob], `massqool-piece.${ext}`, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Massqool', text });
        return;
      }
    } catch {
      // fall through to wa.me link
    }
  }
  try {
    window.open(waUrl, '_blank');
  } catch (err) {
    console.error('WhatsApp open failed', err);
  }
}

export default function GallerySection() {
  const { t, lang } = useLang();
  const { items, categories } = useGallery();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);

  // Close lightbox when filter changes to avoid out-of-bounds index
  useEffect(() => { setLightbox(null); }, [activeCategory]);

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

  const handleShare = (src: string, id: string) => {
    if (sharing) return;
    setSharing(true);
    shareToWhatsApp(src, waMsg(id), lang)
      .catch(console.error)
      .finally(() => setSharing(false));
  };

  const WaIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

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

        {/* Horizontal scroll — gap-3/mb-3 must stay in sync */}
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {filtered.map((item, i) => (
            <motion.div key={item.id} variants={fadeUp}
              className="group relative flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw] overflow-hidden rounded-sm bg-stone cursor-pointer snap-start"
              whileHover={{ y: -3 }} transition={{ duration: 0.3 }}
              role="button" tabIndex={0}
              onClick={() => setLightbox(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightbox(i); }}
            >
              {isDataUrl(item.src) ? (
                <DataUrlImg src={item.src} alt={`Massqool gallery ${i + 1}`}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 ease-out" />
              ) : (
                <img src={item.src} alt={`Massqool gallery ${i + 1}`} loading="lazy"
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 ease-out" />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors duration-300 flex flex-col items-center justify-center gap-3">
                <Eye size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  disabled={sharing}
                  onClick={(e) => { e.stopPropagation(); handleShare(item.src, item.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 bg-[#25D366] disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
                  style={{ fontFamily: font }}>
                  {sharing ? <Loader2 size={14} className="animate-spin" /> : <WaIcon />}
                  {lang === 'ar' ? 'اطلب هذه القطعة' : 'Order This Piece'}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-white/60 hover:text-white p-2 z-10">
              <X size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(p => p !== null ? (p - 1 + filtered.length) % filtered.length : 0); }}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 z-10 text-3xl">‹</button>
            <motion.div key={lightbox} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl max-h-[85vh] aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}>
              {isDataUrl(filtered[lightbox].src) ? (
                <DataUrlImg src={filtered[lightbox].src} alt="Gallery"
                  className="w-full h-full object-contain" />
              ) : (
                <Image src={filtered[lightbox].src} alt="Gallery" fill sizes="100vw" className="object-contain" />
              )}
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(p => p !== null ? (p + 1) % filtered.length : 0); }}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-3 z-10 text-3xl">›</button>
            <button
              disabled={sharing}
              onClick={(e) => { e.stopPropagation(); handleShare(filtered[lightbox].src, filtered[lightbox].id); }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[calc(100%-5rem)] flex items-center gap-2 bg-[#25D366] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full shadow-xl z-10 text-sm hover:bg-[#1fb855] transition-colors whitespace-nowrap"
              style={{ fontFamily: font }}>
              {sharing ? <Loader2 size={18} className="animate-spin" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
              {lang === 'ar' ? 'اطلب هذه القطعة عبر واتساب' : 'Order via WhatsApp'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
