'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface GalleryItem {
  id: string;
  src: string;           // الصورة الكبيرة (lightbox)
  thumbnail?: string;    // صورة المعرض (thumbnail) - اختياري
  category: string;
  isSold?: boolean;
  nameAr?: string;
  nameEn?: string;
  price?: number;
  dimensionsAr?: string;
  dimensionsEn?: string;
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

async function uploadToBlob(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ dataUrl, folder: 'gallery' }),
    });
    const data = await res.json();
    return data.url || dataUrl;
  } catch {
    return dataUrl;
  }
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

interface GalleryContextValue {
  items: GalleryItem[];
  categories: GalleryCategory[];
  addItem: (src: string, category: string, extra?: { nameAr?: string; nameEn?: string; price?: number; dimensionsAr?: string; dimensionsEn?: string; thumbnail?: string }) => void;
  removeItem: (id: string) => void;
  updateItemCategory: (id: string, category: string) => void;
  updateItem: (id: string, data: Partial<GalleryItem>) => void;
  addCategory: (cat: Omit<GalleryCategory, 'key'>) => void;
  removeCategory: (key: string) => void;
  updateItemSold: (id: string, isSold: boolean) => void;
}

const GalleryContext = createContext<GalleryContextValue>({
  items: DEFAULT_IMAGES,
  categories: [],
  addItem: () => {},
  removeItem: () => {},
  updateItemCategory: () => {},
  updateItem: () => {},
  addCategory: () => {},
  removeCategory: () => {},
  updateItemSold: () => {},
});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_IMAGES);
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((data: { items: GalleryItem[]; categories: GalleryCategory[] }) => {
        if (Array.isArray(data.items)) setItems(data.items);
        if (Array.isArray(data.categories)) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  const addItem = useCallback(async (src: string, category: string, extra?: { nameAr?: string; nameEn?: string; price?: number }) => {
    const tempId = crypto.randomUUID();
    setItems(prev => [{ id: tempId, src, category, ...extra }, ...prev]);

    const uploadedSrc = await uploadToBlob(src);
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'addItem', src: uploadedSrc, category, ...extra }),
    });
    const data = await res.json();
    if (data.items) setItems(data.items);
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<GalleryItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'updateItem', id, ...updates }),
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

  const updateItemCategory = useCallback(async (id: string, category: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, category } : i));
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'updateItemCategory', id, category }),
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

  const updateItemSold = useCallback(async (id: string, isSold: boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isSold } : i));
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action: 'updateItemSold', id, isSold }),
    });
    const data = await res.json();
    if (data.items) setItems(data.items);
  }, []);

  return (
    <GalleryContext.Provider value={{ items, categories, addItem, removeItem, updateItemCategory, updateItem, addCategory, removeCategory, updateItemSold }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() { return useContext(GalleryContext); }
