'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LanguageContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, itemCount, openWhatsAppOrder } = useCart();
  const { t, lang } = useLang();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const font = { fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif" };
  const side = lang === 'ar' ? 'right-0' : 'left-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
            onClick={closeCart}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className={`fixed top-0 ${side} z-50 h-full w-full max-w-sm bg-cream flex flex-col shadow-2xl`}
            style={font}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone">
              <h2 className="font-bold text-lg text-charcoal">{t('cart.title')} ({itemCount})</h2>
              <button onClick={closeCart} className="p-2 text-ink/50 hover:text-charcoal transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-ink/40 gap-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <p className="text-sm">{t('cart.empty')}</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 border-b border-stone/50 pb-4"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone">
                      <Image
                        src={item.product.images[0]}
                        alt={lang === 'ar' ? item.product.nameAr : item.product.nameEn}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal text-sm truncate">
                        {lang === 'ar' ? item.product.nameAr : item.product.nameEn}
                      </p>
                      <p className="text-wood-warm font-bold text-sm mt-0.5">
                        {item.product.price.toLocaleString()} {t('product.price')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded border border-stone flex items-center justify-center hover:border-wood-warm transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded border border-stone flex items-center justify-center hover:border-wood-warm transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="mr-auto text-ink/30 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-charcoal font-bold text-base">
                  <span>{t('cart.total')}</span>
                  <span>{total.toLocaleString()} {t('product.price')}</span>
                </div>
                <button
                  onClick={openWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-full text-base hover:bg-[#1aad54] transition-colors duration-200 shadow-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('cart.whatsapp')}
                </button>
                <button
                  onClick={closeCart}
                  className="w-full py-2.5 text-sm text-ink/60 hover:text-charcoal transition-colors text-center"
                >
                  {t('cart.continue')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

