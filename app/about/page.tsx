'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import { WHATSAPP_NUMBER } from '@/data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function AboutPage() {
  const { lang, t } = useLang();
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-charcoal">
        <Image src="/media/images/masqool-hero-05.jpeg" alt="About Massqool" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-charcoal/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl text-white mb-3"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/60 text-base"
            style={{ fontFamily: font }}
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-16 md:py-20" style={{ fontFamily: font }}>
        {/* Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
        >
          <motion.div variants={fadeUp}>
            <span className="text-[#C4956A] text-xs tracking-[0.25em] uppercase mb-4 block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {lang === 'ar' ? 'قصتنا' : 'Our Story'}
            </span>
            <h2
              className="text-3xl md:text-4xl text-charcoal mb-5 leading-tight"
              style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}
            >
              {lang === 'ar' ? 'من الخشب إلى الفن' : 'From Wood to Art'}
            </h2>
            <p className="text-ink/60 leading-relaxed mb-4 text-base">
              {lang === 'ar'
                ? 'مصقول وُلدت من شغف حقيقي بجمال الخشب الطبيعي وقدرته على تحويل المساحات. نؤمن بأن كل قطعة خشبية تحمل روحها الخاصة — عروقها وتشققاتها وسنواتها هي جزء من قصتها.'
                : 'Massqool was born from a genuine passion for the natural beauty of wood and its ability to transform spaces. We believe every piece of wood carries its own soul — its grain, cracks, and years are part of its story.'}
            </p>
            <p className="text-ink/60 leading-relaxed text-base">
              {lang === 'ar'
                ? 'كل ما نصنعه يُشكَّل بالأيدي، ويُنهى بعناية، ويُوزن بالوقت. لا إنتاج ضخم، ولا نسخ متطابقة — فقط قطع فريدة تُصنع لتبقى.'
                : 'Everything we make is shaped by hand, finished with care, and measured by time. No mass production, no identical copies — only unique pieces made to last.'}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone">
            <Image src="/media/images/masqool-hero-06.jpeg" alt="Massqool craft" fill className="object-cover" />
          </motion.div>
        </motion.div>

        {/* Process */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="mb-20"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl text-charcoal mb-10 text-center"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}
          >
            {lang === 'ar' ? 'من الغابة إلى مساحتك' : 'From Forest to Your Space'}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', ar: 'اختيار الخشب', en: 'Wood Selection', icon: '🌳' },
              { step: '02', ar: 'التشكيل والنحت', en: 'Shaping & Carving', icon: '🪵' },
              { step: '03', ar: 'الصقل والتشطيب', en: 'Polishing & Finishing', icon: '✦' },
              { step: '04', ar: 'التسليم والتركيب', en: 'Delivery & Install', icon: '🏠' },
            ].map(({ step, ar, en, icon }) => (
              <motion.div key={step} variants={fadeUp} className="flex flex-col items-center text-center gap-3">
                <div className="text-3xl mb-1">{icon}</div>
                <span className="text-[#C4956A] text-xs font-bold tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{step}</span>
                <p className="text-charcoal font-semibold text-sm">{lang === 'ar' ? ar : en}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center bg-stone/40 rounded-sm p-10"
        >
          <h3
            className="text-2xl md:text-3xl text-charcoal mb-4"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}
          >
            {lang === 'ar' ? 'تواصل مع فريق مصقول' : 'Connect with the Massqool Team'}
          </h3>
          <p className="text-ink/50 mb-7 text-sm">{lang === 'ar' ? 'نرحب باستفساراتك وأفكارك' : 'We welcome your inquiries and ideas'}</p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#1aad54] transition-colors text-sm"
            style={{ fontFamily: font }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('wa.cta')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

