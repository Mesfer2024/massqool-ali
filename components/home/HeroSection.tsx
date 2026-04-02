'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/data/products';

export default function HeroSection() {
  const { t, lang } = useLang();
  const [loaded, setLoaded] = useState(false);
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const subtitle = lang === 'ar'
    ? 'حرفة أصيلة من قلب السعودية — كل قطعة تحكي قصة'
    : 'Authentic Saudi Craftsmanship — Every Piece Tells a Story';

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      {/* Video background */}
      <motion.video
        src="/media/videos/land-page.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />

      {/* Content — centered with navbar offset */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
        {loaded && (
          <div className="mt-28 sm:mt-36 md:mt-48 flex flex-col items-center">

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-10 leading-tight tracking-wide"
              style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 800 }}
            >
              Massqool | مصقول
            </motion.h1>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
              <Link
                href="/collections"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#C4956A] text-white font-semibold rounded-full text-sm sm:text-base hover:bg-[#8B6245] transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                style={{ fontFamily: font }}
              >
                {t('hero.cta.explore')}
              </Link>
            </motion.div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
