'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGallery, GalleryCategory } from '@/context/GalleryContext';
import { Trash2, LogOut, Upload, Plus, X, Images, Tag, Pencil, Check, Percent } from 'lucide-react';
import Image from 'next/image';

const font = "'Cairo', sans-serif";

export default function AdminGalleryPage() {
  const router = useRouter();
  const { items, categories, addItem, removeItem, updateItemCategory, updateItem, addCategory, removeCategory, updateItemSold } = useGallery();
  const [authorized, setAuthorized] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [uploadNameAr, setUploadNameAr] = useState('');
  const [uploadNameEn, setUploadNameEn] = useState('');
  const [uploadPrice, setUploadPrice] = useState('');
  const [uploadOriginalPrice, setUploadOriginalPrice] = useState('');
  const [uploadDimAr, setUploadDimAr] = useState('');
  const [uploadDimEn, setUploadDimEn] = useState('');
  const [uploadDescAr, setUploadDescAr] = useState('');
  const [uploadDescEn, setUploadDescEn] = useState('');
  const [uploadIsNew, setUploadIsNew] = useState(false);
  const [uploadIsOnSale, setUploadIsOnSale] = useState(false);

  // New category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');

  // Edit item state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDimAr, setEditDimAr] = useState('');
  const [editDimEn, setEditDimEn] = useState('');
  const [editDescAr, setEditDescAr] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editIsNew, setEditIsNew] = useState(false);
  const [editIsOnSale, setEditIsOnSale] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin-auth') !== 'true') router.replace('/admin');
    else setAuthorized(true);
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('admin-auth'); window.dispatchEvent(new Event('admin-auth-change')); router.push('/admin'); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const newImages: string[] = [];
    for (const file of Array.from(files).slice(0, 8)) {
      if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) continue;
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(dataUrl);
    }
    setUploadImages(prev => [...prev, ...newImages].slice(0, 8));
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (uploadImages.length === 0) return;
    setUploading(true);
    const secret = localStorage.getItem('admin-secret') || '';
    const uploadedImages = await Promise.all(uploadImages.map(async (img) => {
      if (!img.startsWith('data:')) return img;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
          body: JSON.stringify({ dataUrl: img, folder: 'gallery' }),
        });
        const data = await res.json();
        return data.url || img;
      } catch { return img; }
    }));
    await addItem(uploadedImages[0], selectedCategory, {
      images: uploadedImages,
      nameAr: uploadNameAr.trim() || undefined,
      nameEn: uploadNameEn.trim() || undefined,
      price: uploadPrice ? Number(uploadPrice) : undefined,
      originalPrice: uploadOriginalPrice ? Number(uploadOriginalPrice) : undefined,
      dimensionsAr: uploadDimAr.trim() || undefined,
      dimensionsEn: uploadDimEn.trim() || undefined,
      descriptionAr: uploadDescAr.trim() || undefined,
      descriptionEn: uploadDescEn.trim() || undefined,
      isNew: uploadIsNew,
      isOnSale: uploadIsOnSale,
    });
    setUploading(false);
    setUploadImages([]); setUploadNameAr(''); setUploadNameEn(''); setUploadPrice(''); setUploadOriginalPrice('');
    setUploadDimAr(''); setUploadDimEn(''); setUploadDescAr(''); setUploadDescEn('');
    setUploadIsNew(false); setUploadIsOnSale(false);
  };

  const handleAddCategory = () => {
    if (!newCatAr.trim() || !newCatEn.trim()) return;
    addCategory({ labelAr: newCatAr.trim(), labelEn: newCatEn.trim() });
    setNewCatAr(''); setNewCatEn('');
    setShowCatForm(false);
  };

  const startEdit = (item: typeof items[0]) => {
    setEditingId(item.id);
    setEditImages(item.images || []);
    setEditNameAr(item.nameAr || '');
    setEditNameEn(item.nameEn || '');
    setEditPrice(item.price ? String(item.price) : '');
    setEditOriginalPrice(item.originalPrice ? String(item.originalPrice) : '');
    setEditDimAr(item.dimensionsAr || '');
    setEditDimEn(item.dimensionsEn || '');
    setEditDescAr(item.descriptionAr || '');
    setEditDescEn(item.descriptionEn || '');
    setEditIsNew(item.isNew || false);
    setEditIsOnSale(item.isOnSale || false);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateItem(editingId, {
      images: editImages,
      nameAr: editNameAr.trim() || undefined,
      nameEn: editNameEn.trim() || undefined,
      price: editPrice ? Number(editPrice) : undefined,
      originalPrice: editOriginalPrice ? Number(editOriginalPrice) : undefined,
      dimensionsAr: editDimAr.trim() || undefined,
      dimensionsEn: editDimEn.trim() || undefined,
      descriptionAr: editDescAr.trim() || undefined,
      descriptionEn: editDescEn.trim() || undefined,
      isNew: editIsNew,
      isOnSale: editIsOnSale,
    });
    setEditingId(null);
  };

  const removeEditImage = (idx: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== idx));
  };

  const discountPercent = (price?: number, original?: number) => {
    if (!price || !original || original <= price) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0D0C0A] text-white" style={{ fontFamily: font }}>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Images size={22} /> إدارة المعرض</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} قطعة</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5">
            <LogOut size={16} /> خروج
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => router.push('/admin/products')} className="text-sm px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">المنتجات</button>
          <span className="text-sm px-4 py-2 bg-[#C4956A]/20 text-[#C4956A] rounded-lg font-bold">المعرض</span>
          <button onClick={() => router.push('/admin/reviews')} className="text-sm px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">التعليقات</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* ── Categories ── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2 text-lg"><Tag size={16} /> التصنيفات</h2>
            <button onClick={() => setShowCatForm(!showCatForm)}
              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-[#C4956A] hover:bg-[#8B6245] rounded-xl transition-colors">
              <Plus size={14} /> إضافة تصنيف
            </button>
          </div>
          {showCatForm && (
            <div className="flex flex-wrap gap-3 mb-4 p-4 bg-white/5 rounded-xl">
              <input value={newCatAr} onChange={e => setNewCatAr(e.target.value)} placeholder="الاسم بالعربي"
                className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" style={{ fontFamily: font }} />
              <input value={newCatEn} onChange={e => setNewCatEn(e.target.value)} placeholder="English name"
                className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" style={{ fontFamily: font }} />
              <button onClick={handleAddCategory} className="px-4 py-2 bg-[#C4956A] hover:bg-[#8B6245] rounded-lg text-sm font-bold">حفظ</button>
              <button onClick={() => setShowCatForm(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">إلغاء</button>
            </div>
          )}
          {categories.length === 0 ? (
            <p className="text-white/30 text-sm">لا توجد تصنيفات</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: GalleryCategory) => (
                <div key={cat.key} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm">
                  <span>{cat.labelAr} / {cat.labelEn}</span>
                  <button onClick={() => removeCategory(cat.key)} className="text-white/40 hover:text-red-400"><X size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Upload ── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold flex items-center gap-2 text-lg mb-4"><Plus size={16} /> إضافة قطعة جديدة</h2>

          {/* Images */}
          <div className="mb-4">
            <label className="text-white/50 text-xs mb-2 block">الصور (حتى 8 صور)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {uploadImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image src={img} alt={`img-${i}`} fill className="object-cover" />
                  <button onClick={() => setUploadImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded"><X size={12} /></button>
                </div>
              ))}
              {uploadImages.length < 8 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#C4956A] transition-colors">
                  <Upload size={20} className="text-white/30" />
                  <span className="text-white/40 text-[10px] mt-1">إضافة</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-white/50 text-xs mb-1 block">التصنيف</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                <option value="">بدون تصنيف</option>
                {categories.map((cat: GalleryCategory) => (<option key={cat.key} value={cat.key}>{cat.labelAr}</option>))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">الاسم (عربي)</label>
              <input value={uploadNameAr} onChange={e => setUploadNameAr(e.target.value)} placeholder="تحفة خشبية"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">الاسم (English)</label>
              <input value={uploadNameEn} onChange={e => setUploadNameEn(e.target.value)} placeholder="Wooden Sculpture"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">السعر بعد الخصم</label>
              <input type="text" inputMode="numeric" value={uploadPrice} onChange={e => setUploadPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="650"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block flex items-center gap-1"><Percent size={10} /> السعر قبل الخصم</label>
              <input type="text" inputMode="numeric" value={uploadOriginalPrice} onChange={e => setUploadOriginalPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="800"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">الأبعاد (عربي)</label>
              <input value={uploadDimAr} onChange={e => setUploadDimAr(e.target.value)} placeholder="30 × 20 × 15 سم"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">الأبعاد (English)</label>
              <input value={uploadDimEn} onChange={e => setUploadDimEn(e.target.value)} placeholder="30 × 20 × 15 cm"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <textarea value={uploadDescAr} onChange={e => setUploadDescAr(e.target.value)} placeholder="الوصف بالعربي..." rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none" />
            <textarea value={uploadDescEn} onChange={e => setUploadDescEn(e.target.value)} placeholder="Description in English..." rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>

          {/* Badges */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uploadIsNew} onChange={e => setUploadIsNew(e.target.checked)} className="w-4 h-4 accent-[#C4956A]" />
              <span className="text-sm text-white/70">شارة <span className="text-green-400 font-bold">New</span></span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uploadIsOnSale} onChange={e => setUploadIsOnSale(e.target.checked)} className="w-4 h-4 accent-[#C4956A]" />
              <span className="text-sm text-white/70">شارة <span className="text-red-400 font-bold">Sale</span></span>
            </label>
          </div>

          <button onClick={handleSubmit} disabled={uploadImages.length === 0 || uploading}
            className="w-full flex items-center justify-center gap-2 bg-[#C4956A] hover:bg-[#8B6245] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
            {uploading ? 'جاري الحفظ...' : <><Plus size={18} /> إضافة للمعرض</>}
          </button>
        </div>

        {/* ── Gallery grid ── */}
        <div>
          <h2 className="font-semibold flex items-center gap-2 text-lg mb-4"><Images size={16} /> القطع الحالية</h2>
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 items-start hover:border-white/20 transition-colors">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/5 relative">
                  {(item.images?.[0]) ? (
                    <Image src={item.images[0]} alt={item.nameAr || 'gallery'} fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Images size={20} /></div>
                  )}
                  {(item.isNew || item.isOnSale) && (
                    <div className="absolute top-0.5 right-0.5 flex flex-col gap-0.5">
                      {item.isNew && <span className="bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">New</span>}
                      {item.isOnSale && <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">Sale</span>}
                    </div>
                  )}
                  {item.isSold && (
                    <div className="absolute bottom-0.5 left-0.5 bg-orange-500/80 text-white text-[8px] px-1.5 py-0.5 rounded-full">مباعة</div>
                  )}
                </div>

                {/* Info */}
                {editingId === item.id ? (
                  <div className="flex-1 flex flex-col gap-2">
                    {/* Edit Images */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image src={img} alt={`img-${i}`} fill className="object-cover" />
                          <button onClick={() => removeEditImage(i)} className="absolute top-0.5 right-0.5 bg-red-500 text-white p-0.5 rounded"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={editNameAr} onChange={e => setEditNameAr(e.target.value)} placeholder="الاسم بالعربي"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white" />
                      <input value={editNameEn} onChange={e => setEditNameEn(e.target.value)} placeholder="English name"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" inputMode="numeric" value={editPrice} onChange={e => setEditPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="السعر"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white" />
                      <input type="text" inputMode="numeric" value={editOriginalPrice} onChange={e => setEditOriginalPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="قبل الخصم"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white" />
                      <input value={editDimAr} onChange={e => setEditDimAr(e.target.value)} placeholder="الأبعاد"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white" />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editIsNew} onChange={e => setEditIsNew(e.target.checked)} className="w-4 h-4 accent-[#C4956A]" />
                        <span className="text-xs text-white/70">New</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editIsOnSale} onChange={e => setEditIsOnSale(e.target.checked)} className="w-4 h-4 accent-[#C4956A]" />
                        <span className="text-xs text-white/70">Sale</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#C4956A] rounded-lg"><Check size={12} /> حفظ</button>
                      <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 bg-white/10 rounded-lg">إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm truncate">{item.nameAr || 'بدون اسم'}</span>
                      {item.nameEn && <span className="text-white/30 text-xs truncate">{item.nameEn}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {item.category && (
                        <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/40">
                          {categories.find(c => c.key === item.category)?.labelAr ?? ''}
                        </span>
                      )}
                      {item.originalPrice && item.originalPrice > (item.price || 0) ? (
                        <>
                          <span className="text-white/30 line-through">{item.originalPrice.toLocaleString()}</span>
                          <span className="text-[#C4956A] font-bold">{item.price?.toLocaleString()} ريال</span>
                          <span className="text-red-400 text-[10px]">-{discountPercent(item.price, item.originalPrice)}%</span>
                        </>
                      ) : item.price ? (
                        <span className="text-[#C4956A]">{item.price.toLocaleString()} ريال</span>
                      ) : (
                        <span className="text-white/20">بدون سعر</span>
                      )}
                      {(item.dimensionsAr || item.dimensionsEn) && (
                        <span className="text-white/50">{item.dimensionsAr || item.dimensionsEn}</span>
                      )}
                      {item.isSold && <span className="text-orange-400 font-semibold">مباعة</span>}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {editingId !== item.id && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <select value={item.category} onChange={e => updateItemCategory(item.id, e.target.value)}
                      className="border border-white/10 rounded-lg px-1.5 py-1 text-[10px]" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                      <option value="">تصنيف</option>
                      {categories.map((cat: GalleryCategory) => (<option key={cat.key} value={cat.key}>{cat.labelAr}</option>))}
                    </select>
                    <button onClick={() => startEdit(item)} className="text-xs text-white/50 hover:text-white bg-white/5 p-1.5 rounded-lg" title="تعديل"><Pencil size={13} /></button>
                    <button onClick={() => updateItemSold(item.id, !item.isSold)} className={`text-xs p-1.5 rounded-lg ${item.isSold ? 'bg-orange-500/30 text-orange-400' : 'bg-white/5 text-white/40'}`}>{item.isSold ? '✓' : '○'}</button>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 bg-white/5 p-1.5 rounded-lg" title="حذف"><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
