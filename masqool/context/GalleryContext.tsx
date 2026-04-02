'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export interface GalleryItem {
  id: string;
  src: string;        // /media/... or data:base64
  category: string;  // category key, '' = uncategorized
}

export interface GalleryCategory {
  key: string;
  labelAr: string;
  labelEn: string;
}

const DEFAULT_CATEGORIES: GalleryCategory[] = [
  { key: 'clocks',       labelAr: 'ساعات',  labelEn: 'Clocks' },
  { key: 'tables',       labelAr: 'طاولات', labelEn: 'Tables' },
  { key: 'fireplaces',   labelAr: 'مداخن',  labelEn: 'Fireplaces' },
  { key: 'collectibles', labelAr: 'تحف',    labelEn: 'Collectibles' },
  { key: 'vases',        labelAr: 'فازات',  labelEn: 'Vases' },
  { key: 'other',        labelAr: 'أخرى',   labelEn: 'Other' },
];

const DEFAULT_IMAGES: GalleryItem[] = [
  { id: 'd2',  src: '/media/images/masqool-hero-02.jpeg', category: '' },
  { id: 'd3',  src: '/media/images/masqool-hero-03.jpeg', category: '' },
  { id: 'd4',  src: '/media/images/masqool-hero-04.jpeg', category: '' },
  { id: 'd5',  src: '/media/images/masqool-hero-05.jpeg', category: '' },
  { id: 'd6',  src: '/media/images/masqool-hero-06.jpeg', category: '' },
  { id: 'd7',  src: '/media/images/masqool-hero-10.jpeg', category: '' },
  { id: 'd8',  src: '/media/images/masqool-hero-12.jpeg', category: '' },
  { id: 'd9',  src: '/media/images/masqool-hero-13.jpeg', category: '' },
  { id: 'd10', src: '/media/images/masqool-hero-14.jpeg', category: '' },
  { id: 'd11', src: '/media/images/masqool-hero-16.jpeg', category: '' },
  { id: 'd12', src: '/media/images/masqool-hero-17.jpeg', category: '' },
];

interface GalleryContextValue {
  items: GalleryItem[];
  categories: GalleryCategory[];
  addItem: (src: string, category: string) => void;
  removeItem: (id: string) => void;
  updateItemCategory: (id: string, category: string) => void;
  addCategory: (cat: Omit<GalleryCategory, 'key'>) => void;
  removeCategory: (key: string) => void;
}

const GalleryContext = createContext<GalleryContextValue>({
  items: DEFAULT_IMAGES,
  categories: [],
  addItem: () => {},
  removeItem: () => {},
  updateItemCategory: () => {},
  addCategory: () => {},
  removeCategory: () => {},
});

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems]           = useState<GalleryItem[]>(DEFAULT_IMAGES);
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_CATEGORIES);
  const [ready, setReady]           = useState(false);

  useEffect(() => {
    try {
      const si = localStorage.getItem('massqool-gallery-items');
      const sc = localStorage.getItem('massqool-gallery-categories');
      if (si) setItems(JSON.parse(si));
      if (sc) {
        // دمج التصنيفات المحفوظة مع الافتراضية (بدون تكرار)
        const saved: GalleryCategory[] = JSON.parse(sc);
        const merged = [
          ...DEFAULT_CATEGORIES,
          ...saved.filter(s => !DEFAULT_CATEGORIES.find(d => d.key === s.key)),
        ];
        setCategories(merged);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('massqool-gallery-items',      JSON.stringify(items));
    localStorage.setItem('massqool-gallery-categories', JSON.stringify(categories));
  }, [items, categories, ready]);

  const addItem = (src: string, category: string) =>
    setItems(prev => [{ id: crypto.randomUUID(), src, category }, ...prev]);

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const updateItemCategory = (id: string, category: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, category } : i));

  const addCategory = ({ labelAr, labelEn }: Omit<GalleryCategory, 'key'>) => {
    const key = crypto.randomUUID().slice(0, 8);
    setCategories(prev => [...prev, { key, labelAr, labelEn }]);
  };

  const removeCategory = (key: string) => {
    setCategories(prev => prev.filter(c => c.key !== key));
    setItems(prev => prev.map(i => i.category === key ? { ...i, category: '' } : i));
  };

  return (
    <GalleryContext.Provider value={{ items, categories, addItem, removeItem, updateItemCategory, addCategory, removeCategory }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() { return useContext(GalleryContext); }
