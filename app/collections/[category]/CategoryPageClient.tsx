'use client';
import { useGallery } from '@/context/GalleryContext';
import { useLang } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function CategoryPageClient({ category }: { category: string }) {
  const { lang } = useLang();
  const { categories, items } = useGallery();
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  // Find category info from gallery categories
  const catInfo = categories.find(c => c.key === category);
  if (!catInfo) return notFound();

  // Filter items by category
  const categoryItems = items.filter(item => item.category === category);

  // Get hero image for category
  const CATEGORY_HERO: Record<string, string> = {
    'clocks': '/media/images/masqool-hero-03.jpeg',
    'tables': '/media/images/masqool-hero-09.jpeg',
    'lamps': '/media/images/masqool-hero-06.jpeg',
    'fireplaces': '/media/images/masqool-hero-02.jpeg',
    'collectibles': '/media/images/masqool-hero-05.jpeg',
    'vases': '/media/images/masqool-hero-14.jpeg',
    'other': '/media/images/masqool-hero-16.jpeg',
  };
  const heroImage = CATEGORY_HERO[category] || '/media/images/masqool-hero-03.jpeg';

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-charcoal">
        <Image src={heroImage} alt={lang === 'ar' ? catInfo.labelAr : catInfo.labelEn} fill className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-charcoal/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif", fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {lang === 'ar' ? catInfo.labelAr : catInfo.labelEn}
          </motion.h1>
          <p className="text-white/60 mt-2">{categoryItems.length} {lang === 'ar' ? 'منتج' : 'products'}</p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16" style={{ fontFamily: font }}>
        {categoryItems.length === 0 ? (
          <div className="text-center py-20 text-ink/40">
            <p>{lang === 'ar' ? 'لا توجد منتجات في هذه المجموعة بعد' : 'No products in this collection yet'}</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
          >
            {categoryItems.map((item) => (
              <motion.div
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="group"
              >
                <Link href={item.slug ? `/products/${item.slug}` : '#'} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone mb-4">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={lang === 'ar' ? item.nameAr : item.nameEn || 'Product'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink/20">No Image</div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 start-2 flex flex-col gap-1">
                      {item.isComingSoon && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{lang === 'ar' ? 'قريباً' : 'Coming Soon'}</span>
                      )}
                      {item.isNew && !item.isComingSoon && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{lang === 'ar' ? 'جديد' : 'New'}</span>
                      )}
                      {item.isOnSale && !item.isComingSoon && item.originalPrice && item.price && item.originalPrice > item.price && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    
                    {item.isSold && (
                      <div className="absolute top-2 end-2 bg-black/60 backdrop-blur-sm text-white text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm">
                        {lang === 'ar' ? 'تم البيع' : 'Sold'}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-charcoal truncate" style={{ fontFamily: font }}>
                    {lang === 'ar' ? item.nameAr : item.nameEn || item.nameAr || 'Unnamed'}
                  </h3>                  
                  <div className="flex items-center gap-2 mt-1">
                    {item.originalPrice && item.originalPrice > (item.price || 0) ? (
                      <>
                        <span className="text-ink/40 text-sm line-through">{item.originalPrice.toLocaleString()}</span>
                        <span className="text-[#C4956A] font-bold">{item.price?.toLocaleString()} {lang === 'ar' ? 'ريال' : 'SAR'}</span>
                      </>
                    ) : item.price ? (
                      <span className="text-charcoal font-semibold">{item.price.toLocaleString()} {lang === 'ar' ? 'ريال' : 'SAR'}</span>
                    ) : (
                      <span className="text-ink/40 text-sm">{lang === 'ar' ? 'تواصل للسعر' : 'Contact for price'}</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className="text-center mt-16">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 border border-charcoal/30 text-charcoal font-semibold px-8 py-3.5 rounded-full hover:bg-charcoal hover:text-white transition-all duration-300 text-sm"
            style={{ fontFamily: font }}
          >
            {lang === 'ar' ? 'جميع المجموعات' : 'All Collections'}
          </Link>
        </div>
      </div>
    </div>
  );
}
