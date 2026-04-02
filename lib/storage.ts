import { Redis } from '@upstash/redis';
import { Product } from '@/types/product';
import { Review } from '@/types/review';
import { products as DEFAULT_PRODUCTS } from '@/data/products';

interface GalleryItem {
  id: string;
  src: string;
  category: string;
  isSold?: boolean;
  nameAr?: string;
  nameEn?: string;
  price?: number;
  dimensionsAr?: string;
  dimensionsEn?: string;
}

interface GalleryCategory {
  key: string;
  labelAr: string;
  labelEn: string;
}

const DEFAULT_CATEGORIES: GalleryCategory[] = [
  { key: 'clocks', labelAr: 'ساعات', labelEn: 'Clocks' },
  { key: 'tables', labelAr: 'طاولات', labelEn: 'Tables' },
  { key: 'fireplaces', labelAr: 'مداخن', labelEn: 'Fireplaces' },
  { key: 'collectibles', labelAr: 'تحف', labelEn: 'Collectibles' },
  { key: 'vases', labelAr: 'فازات', labelEn: 'Vases' },
  { key: 'other', labelAr: 'أخرى', labelEn: 'Other' },
];

const DEFAULT_IMAGES: GalleryItem[] = [
  { id: 'd2', src: '/media/images/masqool-hero-02.jpeg', category: '' },
  { id: 'd3', src: '/media/images/masqool-hero-03.jpeg', category: '' },
  { id: 'd4', src: '/media/images/masqool-hero-04.jpeg', category: '' },
  { id: 'd5', src: '/media/images/masqool-hero-05.jpeg', category: '' },
  { id: 'd6', src: '/media/images/masqool-hero-06.jpeg', category: '' },
  { id: 'd7', src: '/media/images/masqool-hero-10.jpeg', category: '' },
  { id: 'd8', src: '/media/images/masqool-hero-12.jpeg', category: '' },
  { id: 'd9', src: '/media/images/masqool-hero-13.jpeg', category: '' },
  { id: 'd10', src: '/media/images/masqool-hero-14.jpeg', category: '' },
  { id: 'd11', src: '/media/images/masqool-hero-16.jpeg', category: '' },
  { id: 'd12', src: '/media/images/masqool-hero-17.jpeg', category: '' },
];

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return redis;
}

// ── Products ──

export async function getProducts(): Promise<Product[]> {
  try {
    const stored = await getRedis().get<Product[]>('massqool:products');
    if (stored && stored.length > 0) return stored;
  } catch (e) {
    console.error('KV getProducts error:', e);
  }
  return DEFAULT_PRODUCTS;
}

export async function setProducts(products: Product[]): Promise<void> {
  await getRedis().set('massqool:products', products);
}

// ── Reviews ──

export async function getReviews(): Promise<Review[]> {
  try {
    const stored = await getRedis().get<Review[]>('massqool:reviews');
    if (stored) return stored;
  } catch (e) {
    console.error('KV getReviews error:', e);
  }
  return [];
}

export async function setReviews(reviews: Review[]): Promise<void> {
  await getRedis().set('massqool:reviews', reviews);
}

// ── Gallery ──

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const stored = await getRedis().get<GalleryItem[]>('massqool:gallery:items');
    if (stored && stored.length > 0) return stored;
  } catch (e) {
    console.error('KV getGalleryItems error:', e);
  }
  return DEFAULT_IMAGES;
}

export async function setGalleryItems(items: GalleryItem[]): Promise<void> {
  await getRedis().set('massqool:gallery:items', items);
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    const stored = await getRedis().get<GalleryCategory[]>('massqool:gallery:categories');
    if (stored && stored.length > 0) return stored;
  } catch (e) {
    console.error('KV getGalleryCategories error:', e);
  }
  return DEFAULT_CATEGORIES;
}

export async function setGalleryCategories(categories: GalleryCategory[]): Promise<void> {
  await getRedis().set('massqool:gallery:categories', categories);
}
