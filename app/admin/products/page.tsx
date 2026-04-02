'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import { Product, ProductCategory } from '@/types/product';
import { Trash2, LogOut, Upload, Plus, Edit3, X, Package, ChevronLeft } from 'lucide-react';
import DataUrlImg from '@/components/ui/DataUrlImg';
import Image from 'next/image';

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const font = "'Cairo', sans-serif";

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'wall-clocks', label: 'ساعات الحائط' },
  { value: 'lamps', label: 'المصابيح' },
  { value: 'side-tables', label: 'الطاولات الجانبية' },
  { value: 'signature', label: 'القطع الحصرية' },
];

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

const emptyForm = (): Omit<Product, 'id'> => ({
  slug: '',
  nameAr: '',
  nameEn: '',
  category: 'wall-clocks' as ProductCategory,
  price: 0,
  images: [],
  descriptionAr: '',
  descriptionEn: '',
  isSignature: false,
  isFeatured: true,
  isSold: false,
  dimensions: { ar: '', en: '' },
  isPlaceholderDimensions: true,
  materials: 'خشب طبيعي أكاسيا',
  whatsappInquiryText: '',
});

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const [authorized, setAuthorized] = useState(false);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem('admin-auth') !== 'true') router.replace('/admin');
    else setAuthorized(true);
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('admin-auth'); window.dispatchEvent(new Event('admin-auth-change')); router.push('/admin'); };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors([]);
    setMode('form');
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      category: product.category,
      price: product.price,
      images: [...product.images],
      descriptionAr: product.descriptionAr,
      descriptionEn: product.descriptionEn,
      isSignature: product.isSignature,
      isFeatured: product.isFeatured,
      isSold: product.isSold ?? false,
      dimensions: product.dimensions ? { ...product.dimensions } : { ar: '', en: '' },
      isPlaceholderDimensions: product.isPlaceholderDimensions ?? true,
      materials: product.materials ?? '',
      whatsappInquiryText: product.whatsappInquiryText,
    });
    setErrors([]);
    setMode('form');
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    const newImages = [...form.images];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      const compressed = await compressImage(file);
      newImages.push(compressed);
    }
    setForm(prev => ({ ...prev, images: newImages }));
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.nameAr.trim()) errs.push('الاسم بالعربية مطلوب');
    if (form.price < 0) errs.push('السعر يجب أن يكون صفر أو أكبر');
    if (form.images.length === 0) errs.push('يجب إضافة صورة واحدة على الأقل');
    if (!form.descriptionAr.trim()) errs.push('الوصف بالعربية مطلوب');
    if (!form.whatsappInquiryText.trim()) errs.push('نص رسالة واتساب مطلوب');
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }

    let slug = slugify(form.nameEn || form.nameAr);
    // Ensure unique slug
    const existing = products.find(p => p.slug === slug && p.id !== editingId);
    if (existing) {
      let i = 2;
      while (products.find(p => p.slug === `${slug}-${i}` && p.id !== editingId)) i++;
      slug = `${slug}-${i}`;
    }

    const productData: Product = {
      id: editingId ?? crypto.randomUUID(),
      slug,
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      category: form.category,
      price: form.price,
      images: form.images,
      descriptionAr: form.descriptionAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      isSignature: form.isSignature,
      isFeatured: form.isFeatured,
      isSold: form.isSold,
      dimensions: (form.dimensions?.ar || form.dimensions?.en) ? form.dimensions : undefined,
      isPlaceholderDimensions: form.isPlaceholderDimensions,
      materials: form.materials?.trim() || undefined,
      whatsappInquiryText: form.whatsappInquiryText.trim(),
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    setMode('list');
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    removeProduct(id);
    setConfirmDeleteId(null);
  };

  if (!authorized) return null;

  // ── Form View ──
  if (mode === 'form') {
    return (
      <div className="min-h-screen bg-[#0D0C0A] text-white" style={{ fontFamily: font }}>
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMode('list')} className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1">
              <ChevronLeft size={16} /> رجوع
            </button>
            <h1 className="text-xl font-bold">{editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              {errors.map((err, i) => <p key={i} className="text-red-400 text-sm">{err}</p>)}
            </div>
          )}

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">الاسم بالعربية *</label>
              <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
                placeholder="ساعة الصحراء" style={{ fontFamily: font }} />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">الاسم بالإنجليزية (اختياري)</label>
              <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
                placeholder="Sahara Wall Clock" style={{ fontFamily: font }} />
            </div>
          </div>

          {/* Slug preview */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">الرابط (يتولد تلقائياً)</label>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 text-sm">
              /products/{slugify(form.nameEn) || '...'}
            </div>
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">التصنيف *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
                className="w-full border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4956A] text-sm"
                style={{ fontFamily: font, backgroundColor: '#1a1a1a', color: '#fff' }}>
                {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">السعر (ريال) *</label>
              <input type="text" inputMode="numeric" value={form.price || ''} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); setForm(f => ({ ...f, price: v ? Number(v) : 0 })); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
                placeholder="1800" style={{ fontFamily: font }} />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">الوصف بالعربية *</label>
            <textarea value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm resize-none"
              placeholder="وصف المنتج بالعربية..." style={{ fontFamily: font }} />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">الوصف بالإنجليزية (اختياري)</label>
            <textarea value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm resize-none"
              placeholder="Product description in English..." style={{ fontFamily: font }} />
          </div>

          {/* Images */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold flex items-center gap-2 text-base mb-4"><Upload size={16} /> صور المنتج *</h3>
            {/* Current images */}
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {form.images.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 group">
                    {src.startsWith('data:') ? (
                      <DataUrlImg src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={src} alt={`img-${i}`} fill sizes="96px" className="object-cover" />
                    )}
                    <button onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X size={20} className="text-red-400" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-[#C4956A] text-white text-[9px] px-1.5 py-0.5 rounded">رئيسية</span>}
                  </div>
                ))}
              </div>
            )}
            {/* Upload zone */}
            <button type="button" onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              disabled={uploading}
              className="w-full border-2 border-dashed border-white/15 hover:border-[#C4956A] rounded-xl py-8 flex flex-col items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer">
              <Upload size={24} className="text-white/30" />
              <p className="text-white/40 text-sm">{uploading ? 'جاري الرفع...' : 'اضغط لاختيار صور أو اسحب وأفلت'}</p>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-2 block">الأبعاد بالعربية</label>
              <input value={form.dimensions?.ar ?? ''} onChange={e => setForm(f => ({ ...f, dimensions: { ar: e.target.value, en: f.dimensions?.en ?? '' } }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
                placeholder="60 × 60 × 5 سم" style={{ fontFamily: font }} />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">الأبعاد بالإنجليزية</label>
              <input value={form.dimensions?.en ?? ''} onChange={e => setForm(f => ({ ...f, dimensions: { ar: f.dimensions?.ar ?? '', en: e.target.value } }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
                placeholder="60 × 60 × 5 cm" style={{ fontFamily: font }} />
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">المواد المستخدمة</label>
            <input value={form.materials ?? ''} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
              placeholder="خشب الجوز الطبيعي، زجاج مقوى" style={{ fontFamily: font }} />
          </div>

          {/* WhatsApp text */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">نص رسالة واتساب *</label>
            <input value={form.whatsappInquiryText} onChange={e => setForm(f => ({ ...f, whatsappInquiryText: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] text-sm"
              placeholder="مرحباً، أودّ الاستفسار عن..." style={{ fontFamily: font }} />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                className="w-5 h-5 rounded bg-white/5 border border-white/20 accent-[#C4956A]" />
              <span className="text-sm text-white/70">يظهر في الصفحة الرئيسية</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isSignature} onChange={e => setForm(f => ({ ...f, isSignature: e.target.checked }))}
                className="w-5 h-5 rounded bg-white/5 border border-white/20 accent-[#C4956A]" />
              <span className="text-sm text-white/70">قطعة حصرية (Signature)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isPlaceholderDimensions} onChange={e => setForm(f => ({ ...f, isPlaceholderDimensions: e.target.checked }))}
                className="w-5 h-5 rounded bg-white/5 border border-white/20 accent-[#C4956A]" />
              <span className="text-sm text-white/70">الأبعاد تقريبية</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isSold} onChange={e => setForm(f => ({ ...f, isSold: e.target.checked }))}
                className="w-5 h-5 rounded bg-white/5 border border-white/20 accent-orange-500" />
              <span className="text-sm text-orange-400 font-semibold">تم بيع هذه القطعة</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button onClick={handleSave}
              className="flex-1 bg-[#C4956A] hover:bg-[#8B6245] text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
              {editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
            <button onClick={() => setMode('list')}
              className="px-8 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
              إلغاء
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="min-h-screen bg-[#0D0C0A] text-white" style={{ fontFamily: font }}>
      <header className="border-b border-white/10 px-6 py-5">
        {/* Top row: title + actions */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Package size={22} /> إدارة المنتجات</h1>
            <p className="text-white/40 text-sm mt-1">{products.length} منتج</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAddForm}
              className="flex items-center gap-1.5 text-sm px-5 py-2.5 bg-[#C4956A] hover:bg-[#8B6245] rounded-xl transition-colors font-bold">
              <Plus size={16} /> إضافة منتج
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">
              <LogOut size={16} /> خروج
            </button>
          </div>
        </div>
        {/* Navigation tabs */}
        <div className="flex items-center gap-1">
          <span className="text-sm px-4 py-2 bg-[#C4956A]/20 text-[#C4956A] rounded-lg font-bold">المنتجات</span>
          <button onClick={() => router.push('/admin/gallery')} className="text-sm px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">المعرض</button>
          <button onClick={() => router.push('/admin/reviews')} className="text-sm px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">التعليقات</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p>لا توجد منتجات</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map(product => (
              <div key={product.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 items-center hover:border-white/20 transition-colors">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/5">
                  {product.images[0]?.startsWith('data:') ? (
                    <DataUrlImg src={product.images[0]} alt={product.nameAr} className="w-full h-full object-cover" />
                  ) : product.images[0] ? (
                    <Image src={product.images[0]} alt={product.nameAr} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Package size={20} /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm truncate">{product.nameAr}</span>
                    <span className="text-white/30 text-xs truncate">{product.nameEn}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full">
                      {CATEGORY_OPTIONS.find(c => c.value === product.category)?.label ?? product.category}
                    </span>
                    <span>{product.price.toLocaleString()} ريال</span>
                    {product.isSignature && <span className="text-[#C4956A]">حصري</span>}
                    {product.isFeatured && <span className="text-green-400">مميز</span>}
                    {product.isSold && <span className="text-orange-400 font-semibold">مباع</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEditForm(product)}
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                    <Edit3 size={13} /> تعديل
                  </button>
                  {confirmDeleteId === product.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors">حذف</button>
                      <button onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors">إلغاء</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(product.id)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                      <Trash2 size={13} /> حذف
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
