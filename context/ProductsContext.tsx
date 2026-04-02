'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { products as DEFAULT_PRODUCTS } from '@/data/products';

interface ProductsContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: DEFAULT_PRODUCTS,
  addProduct: () => {},
  updateProduct: () => {},
  removeProduct: () => {},
});

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('massqool-products');
      if (stored) {
        const saved: Product[] = JSON.parse(stored);
        // Merge: keep saved products + add any new defaults not in saved
        const savedIds = new Set(saved.map(p => p.id));
        const merged = [
          ...saved,
          ...DEFAULT_PRODUCTS.filter(d => !savedIds.has(d.id)),
        ];
        setProducts(merged);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('massqool-products', JSON.stringify(products));
  }, [products, ready]);

  const addProduct = (product: Product) =>
    setProducts(prev => [product, ...prev]);

  const updateProduct = (id: string, updates: Partial<Product>) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const removeProduct = (id: string) =>
    setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() { return useContext(ProductsContext); }
