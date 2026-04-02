'use client';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Upload, X } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useReviews } from '@/context/ReviewsContext';
import DataUrlImg from '@/components/ui/DataUrlImg';

/* ─── Star picker ─── */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110" aria-label={`${n} stars`}>
          <Star size={26} className={`transition-colors ${n <= (hovered || value) ? 'fill-[#C4956A] text-[#C4956A]' : 'text-white/20 fill-transparent'}`} />
        </button>
      ))}
    </div>
  );
}

/* ─── Relative time ─── */
function RelativeTime({ iso, lang }: { iso: string; lang: 'ar' | 'en' }) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  if (diff < 60) return <span>{rtf.format(-Math.round(diff), 'second')}</span>;
  if (diff < 3600) return <span>{rtf.format(-Math.round(diff / 60), 'minute')}</span>;
  if (diff < 86400) return <span>{rtf.format(-Math.round(diff / 3600), 'hour')}</span>;
  return <span>{rtf.format(-Math.round(diff / 86400), 'day')}</span>;
}

/* ─── Image compressor ─── */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const MAX = 600;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/* ─── Photo card with hover overlay ─── */
function PhotoCard({ review, lang, font }: { review: import('@/types/review').Review; lang: 'ar' | 'en'; font: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Photo */}
      {review.photoDataUrl && (
        <DataUrlImg src={review.photoDataUrl} alt={review.name} className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-105" />
      )}

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col justify-between p-5"
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} size={14} className={n <= review.rating ? 'fill-[#C4956A] text-[#C4956A]' : 'fill-transparent text-white/20'} />
              ))}
            </div>

            {/* Review text */}
            <p className="text-white text-sm leading-relaxed line-clamp-5 flex-1 my-4" style={{ fontFamily: font }}>
              {review.text}
            </p>

            {/* Name + time */}
            <div className="flex items-center justify-between">
              <span className="text-[#C4956A] font-semibold text-sm" style={{ fontFamily: font }}>{review.name}</span>
              <span className="text-white/40 text-xs"><RelativeTime iso={review.createdAt} lang={lang} /></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Text-only card (no photo) ─── */
function TextCard({ review, lang, font }: { review: import('@/types/review').Review; lang: 'ar' | 'en'; font: string }) {
  return (
    <motion.div
      className="rounded-2xl bg-white/5 border border-white/10 hover:border-[#C4956A]/40 transition-colors duration-300 flex flex-col justify-between p-5 break-inside-avoid min-h-[180px]"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="flex gap-0.5 mb-4">
          {[1,2,3,4,5].map((n) => (
            <Star key={n} size={14} className={n <= review.rating ? 'fill-[#C4956A] text-[#C4956A]' : 'fill-transparent text-white/20'} />
          ))}
        </div>
        <p className="text-white/70 text-sm leading-relaxed line-clamp-6" style={{ fontFamily: font }}>{review.text}</p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C4956A]/20 flex items-center justify-center text-xs font-bold text-[#C4956A]">
            {review.name[0]?.toUpperCase()}
          </div>
          <span className="text-white/80 text-sm font-semibold" style={{ fontFamily: font }}>{review.name}</span>
        </div>
        <span className="text-white/30 text-xs"><RelativeTime iso={review.createdAt} lang={lang} /></span>
      </div>
    </motion.div>
  );
}

/* ─── Main section ─── */
export default function CustomerReviewsSection() {
  const { lang, t } = useLang();
  const { reviews, addReview } = useReviews();
  const font = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  const headlineFont = lang === 'ar' ? "'Cairo', sans-serif" : "var(--font-cormorant), Georgia, serif";

  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    const compressed = await compressImage(file);
    setPhoto(compressed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError(t('reviews.ratingRequired')); return; }
    if (!name.trim() || !text.trim()) return;
    addReview({ name: name.trim(), text: text.trim(), rating, photoDataUrl: photo ?? undefined });
    setName(''); setText(''); setRating(0); setPhoto(null); setError('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section className="relative py-24 bg-[#0D0C0A] overflow-hidden" style={{ fontFamily: font }}>
      <div className="relative max-w-7xl mx-auto px-5 md:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-[#C4956A] text-xs tracking-[0.3em] uppercase mb-4 block" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              آراء عملائنا
            </span>
            <h2 className="text-4xl md:text-5xl text-white mb-4" style={{ fontFamily: headlineFont, fontWeight: lang === 'ar' ? 700 : 300 }}>
              {t('reviews.title')}
            </h2>
            <div className="w-12 h-px bg-[#C4956A] mx-auto mb-4" />
            <p className="text-white/40 text-base">{t('reviews.subtitle')}</p>
          </motion.div>
        </div>

        {/* Reviews grid — photo-first instagram style */}
        {reviews.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 mb-16 space-y-3">
            {reviews.map((review) =>
              review.photoDataUrl
                ? <PhotoCard key={review.id} review={review} lang={lang} font={font} />
                : <TextCard  key={review.id} review={review} lang={lang} font={font} />
            )}
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-12 mb-16">
            <div className="text-5xl mb-4 opacity-20">★</div>
            <p className="text-white/30 text-base">{t('reviews.empty')}</p>
          </div>
        )}

        {/* Add review form */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="w-full max-w-xl"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              {success ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-[#C4956A]/20 flex items-center justify-center mx-auto mb-4">
                    <Star size={28} className="fill-[#C4956A] text-[#C4956A]" />
                  </div>
                  <p className="text-[#C4956A] font-semibold text-xl">{t('reviews.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="text-white text-xl font-semibold text-center mb-1" style={{ fontFamily: headlineFont }}>
                    {lang === 'ar' ? 'شاركنا تجربتك' : 'Share your experience'}
                  </h3>

                  {/* Stars */}
                  <div>
                    <label className="text-white/50 text-sm mb-3 block">{lang === 'ar' ? 'تقييمك' : 'Your Rating'}</label>
                    <StarRating value={rating} onChange={setRating} />
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  </div>

                  {/* Name */}
                  <input value={name} onChange={(e) => setName(e.target.value.slice(0, 50))} required maxLength={50}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A] transition-colors"
                    placeholder={lang === 'ar' ? 'اسمك الكريم' : 'Your name'} style={{ fontFamily: font }} />

                  {/* Review text */}
                  <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 500))} required minLength={10} maxLength={500} rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A] transition-colors resize-none"
                    placeholder={lang === 'ar' ? 'اكتب رأيك...' : 'Write your review...'} style={{ fontFamily: font }} />

                  {/* Photo upload */}
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">
                      {lang === 'ar' ? 'أضف صورة (اختياري — ستظهر في الاستديو)' : 'Add photo (optional — shown in Studio)'}
                    </label>
                    {photo ? (
                      <div className="relative w-full max-w-xs h-48">
                        <DataUrlImg src={photo} alt={lang === 'ar' ? 'معاينة الصورة' : 'Photo preview'} className="w-full h-full rounded-xl object-cover" />
                        <button type="button"
                          onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ''; }}
                          className="absolute -top-2 -right-2 bg-[#C4956A] text-white rounded-full p-1">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 text-sm text-white/30 border border-dashed border-white/10 rounded-xl px-4 py-4 hover:border-[#C4956A] hover:text-[#C4956A] transition-colors w-full justify-center"
                        style={{ fontFamily: font }}>
                        <Upload size={16} />
                        {lang === 'ar' ? 'ارفع صورة المنتج' : 'Upload product photo'}
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </div>

                  <button type="submit"
                    className="w-full bg-[#C4956A] hover:bg-[#8B6245] text-white font-bold py-4 rounded-xl transition-colors duration-300 text-sm tracking-wide"
                    style={{ fontFamily: font }}>
                    {t('reviews.submit')}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
