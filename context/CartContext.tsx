'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types/product';
import { WHATSAPP_NUMBER } from '@/data/products';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openWhatsAppOrder: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  isOpen: false,
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
  openWhatsAppOrder: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read from localStorage first — runs once on mount
  useEffect(() => {
    const stored = localStorage.getItem('masqool-cart');
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch {}
    }
    setIsInitialized(true);
  }, []);

  // Write to localStorage — only after initialization to avoid overwriting saved cart
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('masqool-cart', JSON.stringify(items));
  }, [items, isInitialized]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.product.id !== productId));

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const openWhatsAppOrder = () => {
    const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const lines = items.map(
      (i) =>
        `- ${lang === 'ar' ? i.product.nameAr : i.product.nameEn} × ${i.quantity} — ${
          i.product.price * i.quantity
        } ريال`
    );
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const msg =
      lang === 'ar'
        ? `طلب جديد من موقع مصقول:\n${lines.join('\n')}\n\nالمجموع: ${total} ريال`
        : `New order from Massqool website:\n${lines.join('\n')}\n\nTotal: SAR ${total}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <CartContext.Provider
      value={{ items, itemCount, isOpen, addItem, removeItem, updateQty, clearCart, openCart, closeCart, openWhatsAppOrder }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

