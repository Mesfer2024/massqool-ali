'use client';
import { WHATSAPP_NUMBER } from '@/data/products';
import { useGallery } from '@/context/GalleryContext';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { notFound } from 'next/navigation';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { lang, t } = useLang();
  const { addItem } = useCart();
  const { products } = useGallery();
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find((p) => p.slug === slug);
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";

  if (!product) return notFound();

  const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(product.whatsappInquiryText)}`;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ink/40 mb-8" style={{ fontFamily: font }}>
          <Link href="/" className="hover:text-wood-warm transition-colors">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-wood-warm transition-colors">{lang === 'ar' ? 'المجموعات' : 'Collections'}</Link>
          <span>/</span>
          <span className="text-ink/60">{lang === 'ar' ? product.nameAr : product.nameEn}</span>
        </div>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <motion.div key={activeImage} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="relative aspect-[4/5] rounded-sm overflow-hidden bg-stone">
              <Image src={product.images[activeImage]} alt={lang === 'ar' ? product.nameAr : product.nameEn} fill className={`object-cover${product.isSold ? ' opacity-80' : ''}`} priority />
              {product.isSold && (
                <div className="absolute bottom-4 start-4 bg-charcoal/75 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ fontFamily: font }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('sold.badge')}
                </div>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={img} onClick={() => setActiveImage(i)} className={`relative aspect-square w-16 rounded-sm overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-wood-warm' : 'border-transparent'}`}>
                    <Image src={img} alt={`${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6" style={{ fontFamily: font }}>
            {product.isSignature && (
              <span className="text-[#C4956A] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {lang === 'ar' ? 'قطعة حصرية' : 'Signature Piece'}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl text-charcoal leading-tight" style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}>
              {lang === 'ar' ? product.nameAr : product.nameEn}
            </h1>
            <p className="text-wood-warm font-bold text-2xl">{product.price.toLocaleString()} {t('product.price')}</p>
            <p className="text-ink/60 leading-relaxed">{lang === 'ar' ? product.descriptionAr : product.descriptionEn}</p>

            {(product.dimensions || product.materials) && (
              <div className="border-t border-stone pt-5 flex flex-col gap-3">
                {product.dimensions && (
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-charcoal w-24 flex-shrink-0">{t('product.dimensions')}</span>
                    <span className="text-ink/60">
                      {product.dimensions[lang]}
                      {product.isPlaceholderDimensions && (
                        <span className="text-xs text-ink/40 ms-1">
                          {lang === 'ar' ? '(تقريبي)' : '(approx.)'}
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {product.materials && (
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-charcoal w-24 flex-shrink-0">{t('product.materials')}</span>
                    <span className="text-ink/60">{product.materials}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              {product.isSold ? (
                <>
                  <div className="w-full bg-charcoal/5 border border-charcoal/10 rounded-2xl py-5 px-6 text-center">
                    <p className="text-charcoal font-bold text-base mb-1">{t('sold.message')}</p>
                    <p className="text-ink/50 text-sm">{t('sold.similarPiece')}</p>
                  </div>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(lang === 'ar' ? 'مرحباً، أريد قطعة مشابهة لـ ' + product.nameAr : 'Hello, I want a piece similar to ' + product.nameEn)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-charcoal/80 text-white font-bold py-4 rounded-full text-sm hover:bg-charcoal transition-colors duration-300"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t('sold.similarPiece')}
                  </a>
                </>
              ) : (
                <>
                  <a href={waHref} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-full text-base hover:bg-[#1aad54] transition-colors duration-300 shadow-md"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t('product.inquiry')}
                  </a>
                  <button onClick={() => addItem(product)}
                    className="w-full py-3.5 border border-charcoal/20 text-charcoal font-semibold rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 text-sm"
                  >
                    {t('product.addCart')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20" style={{ fontFamily: font }}>
            <h2 className="text-2xl md:text-3xl text-charcoal mb-8" style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 400 }}>
              {t('product.related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
