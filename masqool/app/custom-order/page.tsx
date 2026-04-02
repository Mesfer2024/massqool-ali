'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';
import { WHATSAPP_NUMBER } from '@/data/products';
import { X, Upload, ChevronRight, ChevronLeft } from 'lucide-react';

const PRODUCT_TYPES = [
  { ar: 'ساعة حائط', en: 'Wall Clock', icon: '⊕' },
  { ar: 'مصباح', en: 'Lamp', icon: '◎' },
  { ar: 'طاولة جانبية', en: 'Side Table', icon: '▭' },
  { ar: 'لوحة فنية', en: 'Art Piece', icon: '◫' },
  { ar: 'أخرى', en: 'Other', icon: '⊞' },
];

const WOOD_TYPES = [
  { ar: 'طبيعي فاتح', en: 'Light Natural' },
  { ar: 'طبيعي داكن', en: 'Dark Natural' },
  { ar: 'خشب محروق', en: 'Burned Wood' },
  { ar: 'حسب التصميم', en: 'Per Design' },
];

interface FormState {
  productType: string;
  woodType: string;
  dimensions: string;
  instructions: string;
  name: string;
  phone: string;
  city: string;
}

export default function CustomOrderPage() {
  const { lang, t } = useLang();
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif";

  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    productType: '',
    woodType: '',
    dimensions: '',
    instructions: '',
    name: '',
    phone: '',
    city: '',
  });

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - images.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    const type = form.productType || (lang === 'ar' ? 'غير محدد' : 'Not specified');
    const msg = lang === 'ar'
      ? `طلب مخصص من مصقول:\n👤 الاسم: ${form.name}\n📱 الهاتف: ${form.phone}\n📍 المدينة: ${form.city}\n\n🪵 نوع القطعة: ${type}\n🌲 الخشب: ${form.woodType || 'حسب التصميم'}\n📐 الأبعاد: ${form.dimensions || 'غير محدد'}\n\n💬 التعليمات:\n${form.instructions || 'لا يوجد'}\n\n📎 صور مرجعية: ${images.length} صورة`
      : `Custom order from Massqool:\n👤 Name: ${form.name}\n📱 Phone: ${form.phone}\n📍 City: ${form.city}\n\n🪵 Product type: ${type}\n🌲 Wood: ${form.woodType || 'Per design'}\n📐 Dimensions: ${form.dimensions || 'Not specified'}\n\n💬 Instructions:\n${form.instructions || 'None'}\n\n📎 Reference images: ${images.length}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
    // Save to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('masqool-orders') || '[]');
      saved.push({ ...form, imageCount: images.length, timestamp: Date.now() });
      localStorage.setItem('masqool-orders', JSON.stringify(saved));
    } catch {}
  };

  const stepVariants = {
    hidden: { opacity: 0, x: lang === 'ar' ? -30 : 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
    exit: { opacity: 0, x: lang === 'ar' ? 30 : -30, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div
        className="relative h-64 md:h-80 overflow-hidden bg-charcoal"
        style={{ backgroundImage: 'url(/media/images/masqool-hero-07.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pt-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C4956A] text-xs tracking-[0.25em] uppercase mb-3 block"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {lang === 'ar' ? 'Custom Order' : 'طلب مخصص'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold text-white"
            style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}
          >
            {t('custom.title')}
          </motion.h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-5 md:px-10 py-16" style={{ fontFamily: font }}>
        {/* Progress */}
        <div className="flex items-center gap-0 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  s <= step ? 'bg-charcoal text-white' : 'bg-stone text-ink/40'
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-px transition-colors duration-300 ${s < step ? 'bg-charcoal' : 'bg-stone'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
              <h2 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: headlineFont }}>
                {lang === 'ar' ? 'نوع القطعة' : 'Product Type'}
              </h2>
              <p className="text-ink/50 text-sm mb-8">{lang === 'ar' ? 'ماذا تريد أن نصنع لك؟' : 'What would you like us to create?'}</p>

              {/* Type grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {PRODUCT_TYPES.map(({ ar, en, icon }) => {
                  const label = lang === 'ar' ? ar : en;
                  const active = form.productType === label;
                  return (
                    <button
                      key={label}
                      onClick={() => update('productType', label)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all duration-200 ${
                        active ? 'border-charcoal bg-charcoal text-white' : 'border-stone hover:border-wood-warm bg-white/50'
                      }`}
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-sm font-semibold">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Reference images */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-charcoal mb-3">{lang === 'ar' ? 'صور مرجعية (اختياري)' : 'Reference Images (optional)'}</p>
                <div
                  className="border-2 border-dashed border-stone/60 rounded-sm p-6 text-center cursor-pointer hover:border-wood-warm transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={24} className="mx-auto mb-2 text-ink/30" />
                  <p className="text-sm text-ink/40">{t('custom.upload')}</p>
                  <p className="text-xs text-ink/30 mt-1">{lang === 'ar' ? 'حتى 5 صور' : 'Up to 5 images'}</p>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-16 h-16 rounded overflow-hidden">
                        <Image src={src} alt={`ref ${i}`} fill className="object-cover" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 bg-charcoal/70 text-white rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.productType}
                className="w-full py-3.5 bg-charcoal text-white font-bold rounded-full disabled:opacity-40 hover:bg-wood-deep transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
                {lang === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: headlineFont }}>
                  {lang === 'ar' ? 'تفاصيل الفكرة' : 'Idea Details'}
                </h2>
                <p className="text-ink/50 text-sm">{lang === 'ar' ? 'أخبرنا أكثر عن قطعتك' : 'Tell us more about your piece'}</p>
              </div>

              {/* Wood type */}
              <div>
                <label className="text-sm font-semibold text-charcoal block mb-2">{lang === 'ar' ? 'نوع الخشب' : 'Wood Type'}</label>
                <div className="flex flex-wrap gap-2">
                  {WOOD_TYPES.map(({ ar, en }) => {
                    const label = lang === 'ar' ? ar : en;
                    const active = form.woodType === label;
                    return (
                      <button
                        key={label}
                        onClick={() => update('woodType', label)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                          active ? 'border-charcoal bg-charcoal text-white' : 'border-stone text-ink/60 hover:border-wood-warm'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="text-sm font-semibold text-charcoal block mb-2">{lang === 'ar' ? 'الأبعاد (اختياري)' : 'Dimensions (optional)'}</label>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => update('dimensions', e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: 60×60 سم' : 'e.g. 60×60 cm'}
                  className="w-full px-4 py-3 bg-white/70 border border-stone/60 rounded-sm text-ink placeholder-ink/30 text-sm focus:outline-none focus:border-wood-warm transition-colors"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="text-sm font-semibold text-charcoal block mb-2">{lang === 'ar' ? 'تعليمات خاصة' : 'Special Instructions'}</label>
                <textarea
                  rows={4}
                  value={form.instructions}
                  onChange={(e) => update('instructions', e.target.value)}
                  placeholder={t('custom.placeholder')}
                  className="w-full px-4 py-3 bg-white/70 border border-stone/60 rounded-sm text-ink placeholder-ink/30 text-sm focus:outline-none focus:border-wood-warm transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 border border-charcoal/20 text-charcoal font-semibold rounded-full hover:bg-stone/50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  {lang === 'ar' ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-charcoal text-white font-bold rounded-full hover:bg-wood-deep transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {lang === 'ar' ? 'التالي' : 'Next'}
                  {lang === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: headlineFont }}>
                  {lang === 'ar' ? 'بياناتك' : 'Your Details'}
                </h2>
                <p className="text-ink/50 text-sm">{lang === 'ar' ? 'حتى نتواصل معك' : 'So we can reach you'}</p>
              </div>

              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                className="w-full px-4 py-3 bg-white/70 border border-stone/60 rounded-sm text-ink placeholder-ink/30 text-sm focus:outline-none focus:border-wood-warm transition-colors"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder={lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
                className="w-full px-4 py-3 bg-white/70 border border-stone/60 rounded-sm text-ink placeholder-ink/30 text-sm focus:outline-none focus:border-wood-warm transition-colors"
              />
              <input
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder={lang === 'ar' ? 'المدينة' : 'City'}
                className="w-full px-4 py-3 bg-white/70 border border-stone/60 rounded-sm text-ink placeholder-ink/30 text-sm focus:outline-none focus:border-wood-warm transition-colors"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 border border-charcoal/20 text-charcoal font-semibold rounded-full hover:bg-stone/50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  {lang === 'ar' ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.phone}
                  className="flex-1 py-3.5 bg-[#25D366] text-white font-bold rounded-full disabled:opacity-40 hover:bg-[#1aad54] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('custom.whatsapp')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

