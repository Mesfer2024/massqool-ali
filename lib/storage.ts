import { Redis } from '@upstash/redis';
import { Product } from '@/types/product';
import { Review } from '@/types/review';
import { products as DEFAULT_PRODUCTS } from '@/data/products';

interface GalleryItem {
  id: string;
  images: string[];
  category: string;
  isSold?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  nameAr?: string;
  nameEn?: string;
  price?: number;
  originalPrice?: number;
  dimensionsAr?: string;
  dimensionsEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
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
  { id: 'd2', images: ['/media/images/masqool-hero-02.jpeg'], category: '' },
  { id: 'd3', images: ['/media/images/masqool-hero-03.jpeg'], category: '' },
  { id: 'd4', images: ['/media/images/masqool-hero-04.jpeg'], category: '' },
  { id: 'd5', images: ['/media/images/masqool-hero-05.jpeg'], category: '' },
  { id: 'd6', images: ['/media/images/masqool-hero-06.jpeg'], category: '' },
  { id: 'd7', images: ['/media/images/masqool-hero-10.jpeg'], category: '' },
  { id: 'd8', images: ['/media/images/masqool-hero-12.jpeg'], category: '' },
  { id: 'd9', images: ['/media/images/masqool-hero-13.jpeg'], category: '' },
  { id: 'd10', images: ['/media/images/masqool-hero-14.jpeg'], category: '' },
  { id: 'd11', images: ['/media/images/masqool-hero-16.jpeg'], category: '' },
  { id: 'd12', images: ['/media/images/masqool-hero-17.jpeg'], category: '' },
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
    console.log('Redis getProducts:', stored ? `${stored.length} products` : 'null');
    if (stored && stored.length > 0) return stored;
  } catch (e) {
    console.error('KV getProducts error:', e);
  }
  return DEFAULT_PRODUCTS;
}

export async function setProducts(products: Product[]): Promise<void> {
  try {
    console.log('Redis setProducts:', products.length, 'products');
    await getRedis().set('massqool:products', products);
    console.log('Redis setProducts: success');
  } catch (e) {
    console.error('KV setProducts error:', e);
    throw e;
  }
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
