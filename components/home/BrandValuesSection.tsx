'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function BrandValuesSection() {
  const { t, lang } = useLang();
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const bodyFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  const values = [
    { title: t('values.v1.title'), desc: t('values.v1.desc'), symbol: '✦' },
    { title: t('values.v2.title'), desc: t('values.v2.desc'), symbol: '◈' },
    { title: t('values.v3.title'), desc: t('values.v3.desc'), symbol: '◇' },
    { title: t('values.v4.title'), desc: t('values.v4.desc'), symbol: '◎' },
  ];

  return (
    <section className="section-padding bg-stone/30">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h2
            className="text-4xl md:text-5xl text-charcoal mb-3 leading-tight"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('values.title')}
          </h2>
          <div className="w-12 h-px bg-[#C4956A] mx-auto mt-5" />
        </motion.div>

        {/* 4 values grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
        >
          {values.map(({ title, desc, symbol }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex flex-col gap-4 border-t-2 border-[#C4956A]/30 pt-6"
            >
              <span className="text-[#C4956A] text-xl">{symbol}</span>
              <h3
                className="text-charcoal font-bold text-lg leading-snug"
                style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 500 }}
              >
                {title}
              </h3>
              <p className="text-ink/55 text-sm leading-relaxed" style={{ fontFamily: bodyFont }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

