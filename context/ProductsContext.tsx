'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product } from '@/types/product';
import { products as DEFAULT_PRODUCTS } from '@/data/products';

const ADMIN_SECRET = typeof window !== 'undefined'
  ? (document.querySelector('meta[name="admin-secret"]')?.getAttribute('content') || localStorage.getItem('admin-secret') || '')
  : '';

function getSecret(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin-secret') || '';
}

async function uploadImages(images: string[]): Promise<string[]> {
  const result: string[] = [];
  for (const img of images) {
    if (img.startsWith('data:')) {
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
          body: JSON.stringify({ dataUrl: img, folder: 'products' }),
        });
        const data = await res.json();
        result.push(data.url || img);
      } catch {
        result.push(img);
      }
    } else {
      result.push(img);
    }
  }
  return result;
}

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: DEFAULT_PRODUCTS,
  loading: true,
  addProduct: () => {},
  updateProduct: () => {},
  removeProduct: () => {},
});

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then((data: Product[]) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addProduct = useCallback(async (product: Product) => {
    setProducts(prev => [product, ...prev]);
    const uploadedImages = await uploadImages(product.images);
    const uploaded = { ...product, images: uploadedImages };
    setProducts(prev => prev.map(p => p.id === product.id ? uploaded : p));
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
      body: JSON.stringify({ action: 'add', product: uploaded }),
    });
    const data = await res.json();
    if (data.products) setProducts(data.products);
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    let finalUpdates = { ...updates };
    if (updates.images) {
      finalUpdates.images = await uploadImages(updates.images);
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...finalUpdates } : p));
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
      body: JSON.stringify({ action: 'update', id, data: finalUpdates }),
    });
    const data = await res.json();
    if (data.products) setProducts(data.products);
  }, []);

  const removeProduct = useCallback(async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
      body: JSON.stringify({ action: 'remove', id }),
    });
    const data = await res.json();
    if (data.products) setProducts(data.products);
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() { return useContext(ProductsContext); }
