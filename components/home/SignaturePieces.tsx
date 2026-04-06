'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useGallery } from '@/context/GalleryContext';
import { WHATSAPP_NUMBER } from '@/data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export default function SignaturePieces() {
  const { t, lang } = useLang();
  const { products } = useGallery();
  const signaturePieces = products.filter((p) => p.isSignature).slice(0, 3);
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";
  const bodyFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  return (
    <section className="section-padding-lg bg-cream">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center mb-16 md:mb-20"
        >
          <span
            className="text-[#C4956A] text-xs tracking-[0.25em] uppercase mb-4 block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {lang === 'ar' ? 'The Collection' : 'المجموعة'}
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4 leading-tight"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('signature.title')}
          </h2>
          <p className="text-ink/50 max-w-md mx-auto text-base" style={{ fontFamily: bodyFont }}>
            {t('signature.subtitle')}
          </p>
          <div className="w-12 h-px bg-[#C4956A] mx-auto mt-6" />
        </motion.div>

        {/* Signature pieces — editorial layout */}
        <div className="flex flex-col gap-20 md:gap-28">
          {signaturePieces.map((product, index) => {
            const isEven = index % 2 === 0;
            const waMsg = product.whatsappInquiryText;
            const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(waMsg)}`;

            return (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${
                  isEven ? '' : 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
                }`}
              >
                {/* Image */}
                <motion.div
                  variants={fadeUp}
                  className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone"
                >
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[0]}
                      alt={lang === 'ar' ? product.nameAr : product.nameEn}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                  {/* Price tag */}
                  <div className="absolute bottom-4 start-4 bg-charcoal/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold" style={{ fontFamily: bodyFont }}>
                    {product.price.toLocaleString()} {t('product.price')}
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:px-8">
                  <div>
                    <span
                      className="text-[#C4956A] text-xs tracking-[0.2em] uppercase mb-3 block"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {lang === 'ar' ? 'قطعة حصرية' : 'Signature Piece'}
                    </span>
                    <h3
                      className="text-3xl md:text-4xl text-charcoal mb-4 leading-tight"
                      style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}
                    >
                      {lang === 'ar' ? product.nameAr : product.nameEn}
                    </h3>
                    <p className="text-ink/60 leading-relaxed text-base" style={{ fontFamily: bodyFont }}>
                      {lang === 'ar' ? product.descriptionAr : product.descriptionEn}
                    </p>
                  </div>

                  {product.dimensions && (
                    <div className="flex flex-col gap-2 border-t border-stone pt-5" style={{ fontFamily: bodyFont }}>
                      <div className="flex items-center gap-4 text-sm text-ink/50">
                        <span className="font-semibold text-ink/70">{t('product.dimensions')}</span>
                        <span>{product.dimensions[lang]}</span>
                      </div>
                      {product.materials && (
                        <div className="flex items-center gap-4 text-sm text-ink/50">
                          <span className="font-semibold text-ink/70">{t('product.materials')}</span>
                          <span>{product.materials}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1aad54] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                      style={{ fontFamily: bodyFont }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t('signature.inquiry')}
                    </a>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-sm text-ink/50 hover:text-wood-warm transition-colors underline underline-offset-4"
                      style={{ fontFamily: bodyFont }}
                    >
                      {lang === 'ar' ? 'مشاهدة التفاصيل' : 'View Details'}
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View all CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-16"
        >
          <Link
            href="/collections/signature"
            className="inline-flex items-center gap-2 border border-charcoal/30 text-charcoal font-semibold px-8 py-3.5 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 text-sm"
            style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
          >
            {t('signature.viewAll')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

