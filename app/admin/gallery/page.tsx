'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGallery, GalleryCategory } from '@/context/GalleryContext';
import { Trash2, LogOut, Upload, Plus, X, Images, Tag, Pencil, Check } from 'lucide-react';
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

export default function AdminGalleryPage() {
  const router = useRouter();
  const { items, categories, addItem, removeItem, updateItemCategory, updateItem, addCategory, removeCategory, updateItemSold } = useGallery();
  const [authorized, setAuthorized] = useState(false);

  // Upload state
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadNameAr, setUploadNameAr] = useState('');
  const [uploadNameEn, setUploadNameEn] = useState('');
  const [uploadPrice, setUploadPrice] = useState('');
  const [uploadDimAr, setUploadDimAr] = useState('');
  const [uploadDimEn, setUploadDimEn] = useState('');
  const [mainImage, setMainImage] = useState<string>('');      // الصورة الكبيرة
  const [thumbImage, setThumbImage] = useState<string>('');    // صورة المعرض

  // New category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');

  // Edit item state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDimAr, setEditDimAr] = useState('');
  const [editDimEn, setEditDimEn] = useState('');

  const startEdit = (item: typeof items[0]) => {
    setEditingId(item.id);
    setEditNameAr(item.nameAr || '');
    setEditNameEn(item.nameEn || '');
    setEditPrice(item.price ? String(item.price) : '');
    setEditDimAr(item.dimensionsAr || '');
    setEditDimEn(item.dimensionsEn || '');
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateItem(editingId, {
      nameAr: editNameAr.trim() || undefined,
      nameEn: editNameEn.trim() || undefined,
      price: editPrice ? Number(editPrice) : undefined,
      dimensionsAr: editDimAr.trim() || undefined,
      dimensionsEn: editDimEn.trim() || undefined,
    });
    setEditingId(null);
  };
  useEffect(() => {
    if (localStorage.getItem('admin-auth') !== 'true') router.replace('/admin');
    else setAuthorized(true);
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('admin-auth'); window.dispatchEvent(new Event('admin-auth-change')); router.push('/admin'); };

  const handleFiles = async (files: FileList | null, type: 'main' | 'thumb') => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const file = files[0];
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setUploading(false);
      return;
    }
    const compressed = await compressImage(file);
    if (type === 'main') {
      setMainImage(compressed);
    } else {
      setThumbImage(compressed);
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!mainImage) return;
    setUploading(true);
    const extra = {
      nameAr: uploadNameAr.trim() || undefined,
      nameEn: uploadNameEn.trim() || undefined,
      price: uploadPrice ? Number(uploadPrice) : undefined,
      dimensionsAr: uploadDimAr.trim() || undefined,
      dimensionsEn: uploadDimEn.trim() || undefined,
    };
    // رفع الصورتين للـ Blob
    const secret = localStorage.getItem('admin-secret') || '';
    const uploadedMain = await (async () => {
      if (!mainImage.startsWith('data:')) return mainImage;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
          body: JSON.stringify({ dataUrl: mainImage, folder: 'gallery' }),
        });
        const data = await res.json();
        return data.url || mainImage;
      } catch { return mainImage; }
    })();
    const uploadedThumb = thumbImage ? await (async () => {
      if (!thumbImage.startsWith('data:')) return thumbImage;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
          body: JSON.stringify({ dataUrl: thumbImage, folder: 'gallery' }),
        });
        const data = await res.json();
        return data.url || thumbImage;
      } catch { return thumbImage; }
    })() : undefined;
    
    await addItem(uploadedMain, selectedCategory, { ...extra, thumbnail: uploadedThumb });
    setUploading(false);
    setMainImage(''); setThumbImage(''); setUploadNameAr(''); setUploadNameEn(''); setUploadPrice(''); setUploadDimAr(''); setUploadDimEn('');
  };

  const handleAddCategory = () => {
    if (!newCatAr.trim() || !newCatEn.trim()) return;
    addCategory({ labelAr: newCatAr.trim(), labelEn: newCatEn.trim() });
    setNewCatAr(''); setNewCatEn('');
    setShowCatForm(false);
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0D0C0A] text-white" style={{ fontFamily: font }}>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Images size={22} /> إدارة المعرض</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} صورة</p>
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

          {/* Add category form */}
          {showCatForm && (
            <div className="flex flex-wrap gap-3 mb-4 p-4 bg-white/5 rounded-xl">
              <input value={newCatAr} onChange={e => setNewCatAr(e.target.value)}
                placeholder="الاسم بالعربي (مثال: ساعات)"
                className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
              <input value={newCatEn} onChange={e => setNewCatEn(e.target.value)}
                placeholder="English name (e.g. Clocks)"
                className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
              <button onClick={handleAddCategory}
                className="px-4 py-2 bg-[#C4956A] hover:bg-[#8B6245] rounded-lg text-sm font-bold transition-colors">
                حفظ
              </button>
              <button onClick={() => setShowCatForm(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                إلغاء
              </button>
            </div>
          )}

          {/* Category tags */}
          {categories.length === 0 ? (
            <p className="text-white/30 text-sm">لا توجد تصنيفات — أضف تصنيفاً أولاً ثم ارفع الصور</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: GalleryCategory) => (
                <div key={cat.key} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm">
                  <span>{cat.labelAr} / {cat.labelEn}</span>
                  <button onClick={() => removeCategory(cat.key)} className="text-white/40 hover:text-red-400 transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Upload ── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold flex items-center gap-2 text-lg mb-4"><Upload size={16} /> إضافة قطعة جديدة</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Main Image */}
            <div className="border border-white/10 rounded-xl p-4">
              <label className="text-white/50 text-xs mb-2 block">الصورة الكبيرة (Lightbox) *</label>
              {mainImage ? (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image src={mainImage} alt="main" fill className="object-cover" />
                  <button onClick={() => setMainImage('')} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"><X size={14} /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl py-8 cursor-pointer hover:border-[#C4956A] transition-colors">
                  <Upload size={24} className="text-white/30 mb-2" />
                  <span className="text-white/40 text-xs">اضغط لرفع الصورة الكبيرة</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files, 'main')} />
                </label>
              )}
            </div>

            {/* Thumbnail */}
            <div className="border border-white/10 rounded-xl p-4">
              <label className="text-white/50 text-xs mb-2 block">صورة المعرض (Thumbnail) — اختياري</label>
              {thumbImage ? (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={thumbImage} alt="thumb" fill className="object-cover" />
                  <button onClick={() => setThumbImage('')} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"><X size={14} /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl py-8 cursor-pointer hover:border-[#C4956A] transition-colors">
                  <Upload size={24} className="text-white/30 mb-2" />
                  <span className="text-white/40 text-xs">اضغط لرفع صورة المعرض</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files, 'thumb')} />
                </label>
              )}
            </div>
          </div>

          {/* Category selector for upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-white/50 text-xs mb-1 block">التصنيف</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font, backgroundColor: '#1a1a1a', color: '#fff' }}>
                <option value="">بدون تصنيف</option>
                {categories.map((cat: GalleryCategory) => (
                  <option key={cat.key} value={cat.key}>{cat.labelAr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">اسم القطعة (عربي)</label>
              <input value={uploadNameAr} onChange={e => setUploadNameAr(e.target.value)}
                placeholder="مثال: تحفة خشبية"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">اسم القطعة (English)</label>
              <input value={uploadNameEn} onChange={e => setUploadNameEn(e.target.value)}
                placeholder="e.g. Wooden Sculpture"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">السعر (ريال)</label>
              <input type="text" inputMode="numeric" value={uploadPrice} onChange={e => setUploadPrice(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="650"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">الأبعاد (عربي)</label>
              <input value={uploadDimAr} onChange={e => setUploadDimAr(e.target.value)}
                placeholder="مثال: 30 × 20 × 15 سم"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">الأبعاد (English)</label>
              <input value={uploadDimEn} onChange={e => setUploadDimEn(e.target.value)}
                placeholder="e.g. 30 × 20 × 15 cm"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]"
                style={{ fontFamily: font }} />
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!mainImage || uploading}
            className="w-full flex items-center justify-center gap-2 bg-[#C4956A] hover:bg-[#8B6245] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
          >
            {uploading ? 'جاري الحفظ...' : <><Plus size={18} /> إضافة للمعرض</>}
          </button>
        </div>

        {/* ── Gallery grid ── */}
        <div>
          <h2 className="font-semibold flex items-center gap-2 text-lg mb-4"><Images size={16} /> الصور الحالية</h2>
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 items-start hover:border-white/20 transition-colors">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/5 relative">
                  {(item.thumbnail || item.src) ? (
                    <Image 
                      src={item.thumbnail || item.src} 
                      alt={item.nameAr || 'gallery'} 
                      fill 
                      sizes="80px" 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Images size={20} />
                    </div>
                  )}
                  {item.isSold && (
                    <div className="absolute bottom-0.5 left-0.5 bg-orange-500/80 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                      مباعة
                    </div>
                  )}
                </div>

                {/* Info */}
                {editingId === item.id ? (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2 mb-2">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={item.thumbnail || item.src} alt="thumb" fill className="object-cover" />
                        <span className="absolute bottom-0 left-0 bg-black/60 text-[8px] px-1">معرض</span>
                      </div>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image src={item.src} alt="main" fill className="object-cover" />
                        <span className="absolute bottom-0 left-0 bg-black/60 text-[8px] px-1">كبيرة</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={editNameAr} onChange={e => setEditNameAr(e.target.value)} placeholder="الاسم بالعربي"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]" style={{ fontFamily: font }} />
                      <input value={editNameEn} onChange={e => setEditNameEn(e.target.value)} placeholder="English name"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]" style={{ fontFamily: font }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" inputMode="numeric" value={editPrice} onChange={e => setEditPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="السعر"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]" style={{ fontFamily: font }} />
                      <input value={editDimAr} onChange={e => setEditDimAr(e.target.value)} placeholder="الأبعاد (عربي)"
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]" style={{ fontFamily: font }} />
                    </div>
                    <div className="flex gap-2 items-center">
                      <input value={editDimEn} onChange={e => setEditDimEn(e.target.value)} placeholder="Dimensions (English)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[#C4956A]" style={{ fontFamily: font }} />
                      <button onClick={saveEdit} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#C4956A] hover:bg-[#8B6245] rounded-lg transition-colors"><Check size={12} /> حفظ</button>
                      <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm truncate">{item.nameAr || 'بدون اسم'}</span>
                      {item.nameEn && <span className="text-white/30 text-xs truncate">{item.nameEn}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      {item.category && (
                        <span className="bg-white/10 px-2 py-0.5 rounded-full">
                          {categories.find(c => c.key === item.category)?.labelAr ?? ''}
                        </span>
                      )}
                      {item.price ? <span className="text-[#C4956A]">{item.price.toLocaleString()} ريال</span> : <span className="text-white/20">بدون سعر</span>}
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
                      className="border border-white/10 rounded-lg px-1.5 py-1 text-[10px] focus:outline-none"
                      style={{ fontFamily: font, backgroundColor: '#1a1a1a', color: '#fff' }}>
                      <option value="">تصنيف</option>
                      {categories.map((cat: GalleryCategory) => (
                        <option key={cat.key} value={cat.key}>{cat.labelAr}</option>
                      ))}
                    </select>
                    <button onClick={() => startEdit(item)}
                      className="text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors" title="تعديل">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => updateItemSold(item.id, !item.isSold)}
                      className={`text-xs p-1.5 rounded-lg transition-colors ${item.isSold ? 'bg-orange-500/30 text-orange-400' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                      title={item.isSold ? 'إلغاء البيع' : 'تحديد كمباعة'}>
                      {item.isSold ? '✓' : '○'}
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors" title="حذف">
                      <Trash2 size={13} />
                    </button>
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
