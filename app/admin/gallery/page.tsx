'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGallery, GalleryCategory } from '@/context/GalleryContext';
import { Trash2, LogOut, Upload, Plus, X, Images, Tag } from 'lucide-react';
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
  const { items, categories, addItem, removeItem, updateItemCategory, addCategory, removeCategory, updateItemSold } = useGallery();
  const [authorized, setAuthorized] = useState(false);

  // Upload state
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // New category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatEn, setNewCatEn] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin-auth') !== 'true') router.replace('/admin');
    else setAuthorized(true);
  }, [router]);

  const handleLogout = () => { localStorage.removeItem('admin-auth'); window.dispatchEvent(new Event('admin-auth-change')); router.push('/admin'); };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      const compressed = await compressImage(file);
      addItem(compressed, selectedCategory);
    }
    setUploading(false);
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
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/reviews')}
            className="text-white/40 hover:text-white text-sm transition-colors">
            ← التعليقات
          </button>
          <button onClick={() => router.push('/admin/products')}
            className="text-white/40 hover:text-white text-sm transition-colors">
            المنتجات
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Images size={20} /> إدارة المعرض</h1>
            <p className="text-white/40 text-sm mt-0.5">{items.length} صورة</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
          <LogOut size={16} /> خروج
        </button>
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
          <h2 className="font-semibold flex items-center gap-2 text-lg mb-4"><Upload size={16} /> رفع صور جديدة</h2>

          {/* Category selector for upload */}
          <div className="mb-4">
            <label className="text-white/50 text-sm mb-2 block">التصنيف (اختياري)</label>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
              className="border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C4956A]"
              style={{ fontFamily: font, backgroundColor: '#1a1a1a', color: '#fff' }}>
              <option value="">بدون تصنيف</option>
              {categories.map((cat: GalleryCategory) => (
                <option key={cat.key} value={cat.key}>{cat.labelAr}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            disabled={uploading}
            className="w-full border-2 border-dashed border-white/15 hover:border-[#C4956A] rounded-xl py-12 flex flex-col items-center gap-3 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Upload size={32} className="text-white/30" />
            <p className="text-white/40 text-sm">{uploading ? 'جاري الرفع...' : 'اضغط لاختيار صور أو اسحب وأفلت'}</p>
            <p className="text-white/20 text-xs">JPG, PNG, WEBP — حتى 10MB لكل صورة</p>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => handleFiles(e.target.files)} />
        </div>

        {/* ── Gallery grid ── */}
        <div>
          <h2 className="font-semibold flex items-center gap-2 text-lg mb-4"><Images size={16} /> الصور الحالية</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map(item => (
              <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5">
                {item.src.startsWith('data:') ? (
                  <DataUrlImg src={item.src} alt="gallery" className="w-full h-full object-cover" />
                ) : (
                  <Image src={item.src} alt="gallery" fill sizes="200px" className="object-cover" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* Change category */}
                  <select
                    value={item.category}
                    onChange={e => updateItemCategory(item.id, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="border border-white/20 rounded-lg px-2 py-1 text-xs w-28 focus:outline-none"
                    style={{ fontFamily: font, backgroundColor: '#1a1a1a', color: '#fff' }}
                  >
                    <option value="">بدون تصنيف</option>
                    {categories.map((cat: GalleryCategory) => (
                      <option key={cat.key} value={cat.key}>{cat.labelAr}</option>
                    ))}
                  </select>
                  {/* Sold toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); updateItemSold(item.id, !item.isSold); }}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${item.isSold ? 'bg-orange-500/80 text-white hover:bg-orange-600' : 'bg-white/20 text-white/70 hover:bg-white/30'}`}
                  >
                    {item.isSold ? 'مباعة' : 'متاحة'}
                  </button>
                  {/* Delete */}
                  <button onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-black/60 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={12} /> حذف
                  </button>
                </div>

                {/* Category badge */}
                {item.category && (
                  <div className="absolute top-1.5 right-1.5 bg-[#C4956A]/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {categories.find(c => c.key === item.category)?.labelAr ?? ''}
                  </div>
                )}
                {item.isSold && (
                  <div className="absolute bottom-1.5 left-1.5 bg-orange-500/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                    مباعة
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
