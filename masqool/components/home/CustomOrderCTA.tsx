'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { WHATSAPP_NUMBER } from '@/data/products';

const PRODUCT_TYPES = [
  { keyAr: 'ساعة حائط', keyEn: 'Wall Clock', icon: '⊕' },
  { keyAr: 'مصباح', keyEn: 'Lamp', icon: '◎' },
  { keyAr: 'طاولة', keyEn: 'Table', icon: '▭' },
  { keyAr: 'لوحة فنية', keyEn: 'Art Piece', icon: '◫' },
  { keyAr: 'أخرى', keyEn: 'Other', icon: '⊞' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function CustomOrderCTA() {
  const { t, lang } = useLang();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [idea, setIdea] = useState('');
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const bodyFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  const handleWhatsApp = () => {
    const type = selectedType || (lang === 'ar' ? 'غير محدد' : 'Not specified');
    const msg = lang === 'ar'
      ? `طلب مخصص من موقع مصقول:\nنوع القطعة: ${type}\nالفكرة: ${idea || 'لم يُذكر'}`
      : `Custom order from Massqool website:\nProduct type: ${type}\nIdea: ${idea || 'Not specified'}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="section-padding bg-beige overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone order-2 lg:order-1"
          >
            <Image
              src="/media/images/masqool-hero-07.jpeg"
              alt="Custom Wood Order"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
          </motion.div>

          {/* Form panel */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="flex flex-col gap-7 order-1 lg:order-2"
          >
            <motion.div variants={fadeUp}>
              <span
                className="text-[#C4956A] text-xs tracking-[0.25em] uppercase mb-3 block"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {lang === 'ar' ? 'Custom Order' : 'طلب مخصص'}
              </span>
              <h2
                className="text-4xl md:text-5xl text-charcoal leading-tight mb-3"
                style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
              >
                {t('custom.title')}
              </h2>
              <p className="text-ink/60 text-base leading-relaxed" style={{ fontFamily: bodyFont }}>
                {t('custom.subtitle')}
              </p>
            </motion.div>

            {/* Type selector */}
            <motion.div variants={fadeUp}>
              <p className="text-sm font-semibold text-charcoal mb-3" style={{ fontFamily: bodyFont }}>
                {lang === 'ar' ? 'نوع القطعة' : 'Product Type'}
              </p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_TYPES.map(({ keyAr, keyEn, icon }) => {
                  const label = lang === 'ar' ? keyAr : keyEn;
                  const isActive = selectedType === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setSelectedType(label)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'border-stone/70 text-ink/60 hover:border-wood-warm hover:text-wood-warm bg-white/50'
                      }`}
                      style={{ fontFamily: bodyFont }}
                    >
                      <span>{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Idea textarea */}
            <motion.div variants={fadeUp}>
              <textarea
                rows={3}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t('custom.placeholder')}
                className="w-full px-4 py-3 bg-white/70 border border-stone/60 rounded-sm text-ink placeholder-ink/30 text-sm focus:outline-none focus:border-wood-warm transition-colors resize-none"
                style={{ fontFamily: bodyFont }}
              />
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#1aad54] transition-all duration-300 shadow-md text-sm"
                style={{ fontFamily: bodyFont }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('custom.whatsapp')}
              </button>
              <Link
                href="/custom-order"
                className="flex items-center justify-center gap-2 border border-charcoal/30 text-charcoal font-semibold px-6 py-3.5 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 text-sm"
                style={{ fontFamily: bodyFont }}
              >
                {t('custom.cta')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

