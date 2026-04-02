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

export default function CollectionsGrid() {
  const { t, lang } = useLang();
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const bodyFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  const mainCategories = categories.slice(0, 3);
  const subCategories = categories.slice(3);

  return (
    <section className="section-padding bg-stone/40">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl text-charcoal mb-3 leading-tight"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('collections.title')}
          </h2>
          <p className="text-ink/50 text-base" style={{ fontFamily: bodyFont }}>
            {t('collections.subtitle')}
          </p>
          <div className="w-12 h-px bg-[#C4956A] mx-auto mt-5" />
        </motion.div>

        {/* Main 3 categories */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
        >
          {mainCategories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <CategoryCard cat={cat} lang={lang} browseLabel={t('collections.browse')} tall />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom 2 categories */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {subCategories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <CategoryCard cat={cat} lang={lang} browseLabel={t('collections.browse')} tall={false} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  lang,
  browseLabel,
  tall,
}: {
  cat: (typeof categories)[0];
  lang: string;
  browseLabel: string;
  tall: boolean;
}) {
  return (
    <Link
      href={cat.href}
      className={`group relative overflow-hidden rounded-sm block ${tall ? 'aspect-[3/4]' : 'aspect-[16/9]'} bg-charcoal`}
    >
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="absolute inset-0"
      >
        <Image
          src={cat.image}
          alt={lang === 'ar' ? cat.nameAr : cat.nameEn}
          fill
          className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </motion.div>
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3
          className="text-white font-bold text-xl mb-1.5"
          style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif", fontWeight: lang === 'ar' ? 700 : 400 }}
        >
          {lang === 'ar' ? cat.nameAr : cat.nameEn}
        </h3>
        <span
          className="text-[#C4956A] text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300"
          style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
        >
          {browseLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

