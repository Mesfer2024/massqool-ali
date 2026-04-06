'use client';
import { categories } from '@/data/products';
import { useGallery } from '@/context/GalleryContext';
import ProductCard from '@/components/product/ProductCard';
import { useLang } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCategory } from '@/types/product';

const CATEGORY_NAMES: Record<string, { ar: string; en: string }> = {
  'wall-clocks': { ar: 'ساعات الحائط', en: 'Wall Clocks' },
  'lamps': { ar: 'المصابيح', en: 'Lamps' },
  'side-tables': { ar: 'الطاولات الجانبية', en: 'Side Tables' },
  'signature': { ar: 'القطع الحصرية', en: 'Signature Pieces' },
};

export default function CategoryPageClient({ category }: { category: string }) {
  const { lang } = useLang();
  const { products } = useGallery();
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";

  const catInfo = CATEGORY_NAMES[category];
  if (!catInfo) return notFound();

  const categoryProducts = category === 'signature'
    ? products.filter((p) => p.isSignature)
    : products.filter((p) => p.category === category as ProductCategory);

  const heroImage = categories.find((c) => c.id === category)?.image || '/media/images/masqool-hero-03.jpeg';

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-charcoal">
        <Image src={heroImage} alt={lang === 'ar' ? catInfo.ar : catInfo.en} fill className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 to-charcoal/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif", fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {lang === 'ar' ? catInfo.ar : catInfo.en}
          </motion.h1>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16" style={{ fontFamily: font }}>
        {categoryProducts.length === 0 ? (
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
            {categoryProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              >
                <ProductCard product={product} />
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
