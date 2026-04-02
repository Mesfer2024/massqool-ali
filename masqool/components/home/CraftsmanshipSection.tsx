'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';

const CRAFT_IMAGES = [
  '/media/images/masqool-hero-07.jpeg',
  '/media/images/masqool-hero-08.jpeg',
  '/media/images/masqool-hero-11.jpeg',
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function CraftsmanshipSection() {
  const { t, lang } = useLang();
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const bodyFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  const stats = [
    { label: t('craft.stat1'), icon: '✦' },
    { label: t('craft.stat2'), icon: '◈' },
    { label: t('craft.stat3'), icon: '◇' },
  ];

  return (
    <section className="bg-charcoal py-20 md:py-28 overflow-hidden">
      {/* Subtle wood texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #C4956A 0px, transparent 1px, transparent 40px)', backgroundSize: '40px 100%' }} />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative">
        {/* Section label */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span
            className="text-[#C4956A] text-xs tracking-[0.25em] uppercase mb-4 block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {lang === 'ar' ? 'The Craft' : 'الحرفة'}
          </span>
          <h2
            className="text-4xl md:text-5xl text-white mb-5 leading-tight"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('craft.title')}
          </h2>
          <div className="w-12 h-px bg-[#C4956A] mx-auto" />
        </motion.div>

        {/* Pull quote */}
        <motion.blockquote
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p
            className="text-white/70 text-xl md:text-2xl lg:text-3xl leading-relaxed italic"
            style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}
          >
            {t('craft.quote')}
          </p>
        </motion.blockquote>

        {/* Image trio */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-3 gap-3 md:gap-4 mb-16"
        >
          {CRAFT_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              className={`relative overflow-hidden rounded-sm bg-stone/10 ${i === 1 ? 'mt-6 md:mt-10' : ''}`}
              style={{ aspectRatio: '2/3' }}
            >
              <Image
                src={src}
                alt="Massqool craftsmanship"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-12"
        >
          {stats.map(({ label, icon }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <div className="text-[#C4956A] text-2xl mb-3">{icon}</div>
              <p
                className="text-white font-semibold text-base"
                style={{ fontFamily: bodyFont }}
              >
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

