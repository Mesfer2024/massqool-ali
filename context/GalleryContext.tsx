'use client';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Product, ProductCategory } from '@/types/product';

export interface GalleryItem {
  id: string;
  images: string[];
  src?: string;
  category: string;
  isSold?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isComingSoon?: boolean;
  isFeatured?: boolean;
  nameAr?: string;
  nameEn?: string;
  price?: number;
  originalPrice?: number;
  dimensionsAr?: string;
  dimensionsEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  materials?: string;
  whatsappInquiryText?: string;
  slug?: string;
}

export interface GalleryCategory {
  key: string;
  labelAr: string;
  labelEn: string;
}

function getSecret(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin-secret') || '';
}

function adminHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() };
}

// Helper to convert GalleryItem to Product type
function galleryItemToProduct(item: GalleryItem): Product {
  const slug = item.slug || item.nameAr?.toLowerCase().replace(/\s+/g, '-') || item.id;
  const categoryMap: Record<string, ProductCategory> = {
    'clocks': 'wall-clocks',
    'tables': 'side-tables',
    'lamps': 'lamps',
    'collectibles': 'signature',
    'fireplaces': 'signature',
    'vases': 'signature',
    'other': 'signature',
  };
  
  return {
    id: item.id,
    slug: slug,
    nameAr: item.nameAr || 'منتج بدون اسم',
    nameEn: item.nameEn || 'Unnamed Product',
    category: categoryMap[item.category] || 'signature',
    price: item.price || 0,
    images: item.images?.length ? item.images : item.src ? [item.src] : [],
    descriptionAr: item.descriptionAr || '',
    descriptionEn: item.descriptionEn || '',
    isSignature: item.category === 'collectibles' || item.category === 'fireplaces' || item.category === 'vases' || item.category === 'other',
    isFeatured: item.isFeatured || false,
    isSold: item.isSold,
    dimensions: item.dimensionsAr || item.dimensionsEn ? { ar: item.dimensionsAr || '', en: item.dimensionsEn || '' } : undefined,
    isPlaceholderDimensions: true,
    materials: item.materials,
    whatsappInquiryText: item.whatsappInquiryText || `مرحباً، أودّ الاستفسار عن ${item.nameAr || 'هذا المنتج'}`,
  };
}

const DEFAULT_CATEGORIES: GalleryCategory[] = [
  { key: 'clocks', labelAr: 'ساعات', labelEn: 'Clocks' },
  { key: 'tables', labelAr: 'طاولات', labelEn: 'Tables' },
  { key: 'fireplaces', labelAr: 'مداخن', labelEn: 'Fireplaces' },
  { key: 'collectibles', labelAr: 'تحف', labelEn: 'Collectibles' },
  { key: 'vases', labelAr: 'فازات', labelEn: 'Vases' },
  { key: 'other', labelAr: 'أخرى', labelEn: 'Other' },
];

interface GalleryContextValue {
  items: GalleryItem[];
  categories: GalleryCategory[];
  loading: boolean;
  // Product-compatible interface
  products: Product[];
  addItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, data: Partial<GalleryItem>) => Promise<void>;
  addCategory: (cat: Omit<GalleryCategory, 'key'>) => Promise<void>;
  removeCategory: (key: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextValue>({
  items: [],
  categories: DEFAULT_CATEGORIES,
  loading: true,
  products: [],
  addItem: async () => {},
  removeItem: async () => {},
  updateItem: async () => {},
  addCategory: async () => {},
  removeCategory: async () => {},
});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((data: { items: GalleryItem[]; categories: GalleryCategory[] }) => {
        if (Array.isArray(data.items)) setItems(data.items);
        if (Array.isArray(data.categories)) setCategories(data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Convert items to products for backward compatibility
  const products = useMemo(() => items.map(galleryItemToProduct), [items]);

  const addItem = useCallback(async (item: Omit<GalleryItem, 'id'>) => {
    const tempId = crypto.randomUUID();
    const newItem = { ...item, id: tempId };
    setItems(prev => [newItem, ...prev]);

    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'addItem', item }),
    });
    const data = await res.json();
    if (data.items) setItems(data.items);
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<GalleryItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'updateItem', id, updates }),
    });
    const data = await res.json();
    if (data.items) setItems(data.items);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'removeItem', id }),
    });
    const data = await res.json();
    if (data.items) setItems(data.items);
  }, []);

  const addCategory = useCallback(async ({ labelAr, labelEn }: Omit<GalleryCategory, 'key'>) => {
    const tempKey = crypto.randomUUID().slice(0, 8);
    setCategories(prev => [...prev, { key: tempKey, labelAr, labelEn }]);
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'addCategory', labelAr, labelEn }),
    });
    const data = await res.json();
    if (data.categories) setCategories(data.categories);
  }, []);

  const removeCategory = useCallback(async (key: string) => {
    setCategories(prev => prev.filter(c => c.key !== key));
    setItems(prev => prev.map(i => i.category === key ? { ...i, category: '' } : i));
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'removeCategory', key }),
    });
    const data = await res.json();
    if (data.categories) setCategories(data.categories);
    if (data.items) setItems(data.items);
  }, []);

  return (
    <GalleryContext.Provider value={{ items, categories, loading, products, addItem, removeItem, updateItem, addCategory, removeCategory }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() { return useContext(GalleryContext); }
