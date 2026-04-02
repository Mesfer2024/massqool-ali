'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { categories } from '@/data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function CollectionPageClient() {
  const { lang, t } = useLang();
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const bodyFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h1
            className="text-4xl md:text-5xl text-charcoal mb-3"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('collections.title')}
          </h1>
          <p className="text-ink/50" style={{ fontFamily: bodyFont }}>
            {t('collections.subtitle')}
          </p>
          <div className="w-12 h-px bg-[#C4956A] mx-auto mt-5" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link
                href={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-charcoal"
              >
                <Image
                  src={cat.image}
                  alt={lang === 'ar' ? cat.nameAr : cat.nameEn}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className="text-white text-xl font-bold mb-1"
                    style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}
                  >
                    {lang === 'ar' ? cat.nameAr : cat.nameEn}
                  </h3>
                  <span
                    className="text-[#C4956A] text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300"
                    style={{ fontFamily: bodyFont }}
                  >
                    {t('collections.browse')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

