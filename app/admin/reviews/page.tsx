'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReviews } from '@/context/ReviewsContext';
import { Review } from '@/types/review';
import { Star, Trash2, LogOut, Pencil, X, Check } from 'lucide-react';
import DataUrlImg from '@/components/ui/DataUrlImg';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <Star key={n} size={13}
          className={n <= rating ? 'fill-[#C4956A] text-[#C4956A]' : 'fill-transparent text-white/20'} />
      ))}
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="text-white/60 text-xs">تأكيد الحذف؟</span>
      <button onClick={onConfirm} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors">حذف</button>
      <button onClick={onCancel}  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors">إلغاء</button>
    </div>
  );
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const { reviews, deleteReview, updateReview } = useReviews();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin-auth') !== 'true') {
      router.replace('/admin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    window.dispatchEvent(new Event('admin-auth-change'));
    router.push('/admin');
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    setConfirmId(null);
  };

  const startEdit = (review: Review) => {
    setEditId(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const saveEdit = () => {
    if (editId && editText.trim()) {
      updateReview(editId, { text: editText.trim(), rating: editRating });
      setEditId(null);
    }
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#0D0C0A] text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">إدارة التعليقات</h1>
            <p className="text-white/40 text-sm mt-1">{reviews.length} تعليق</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5"
          >
            <LogOut size={16} /> خروج
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => router.push('/admin/gallery')} className="text-sm px-4 py-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">المنتجات</button>
          <span className="text-sm px-4 py-2 bg-[#C4956A]/20 text-[#C4956A] rounded-lg font-bold">التعليقات</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {reviews.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <div className="text-5xl mb-4">★</div>
            <p>لا توجد تعليقات بعد</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((review: Review) => (
              <div key={review.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 items-start hover:border-white/20 transition-colors">

                {/* Avatar / Photo */}
                <div className="flex-shrink-0">
                  {review.photoDataUrl ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#C4956A]/40">
                      <DataUrlImg src={review.photoDataUrl} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#C4956A]/20 flex items-center justify-center text-lg font-bold text-[#C4956A]">
                      {review.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-semibold text-white text-base">{review.name}</span>
                    <span className="text-white/30 text-xs flex-shrink-0">
                      {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>

                  {editId === review.id ? (
                    <div className="flex flex-col gap-3 mt-2">
                      {/* Edit rating */}
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((n) => (
                          <button key={n} onClick={() => setEditRating(n)}>
                            <Star size={16} className={n <= editRating ? 'fill-[#C4956A] text-[#C4956A]' : 'fill-transparent text-white/20'} />
                          </button>
                        ))}
                      </div>
                      {/* Edit text */}
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C4956A] resize-none"
                        style={{ fontFamily: "'Cairo', sans-serif" }} />
                      <div className="flex gap-2">
                        <button onClick={saveEdit}
                          className="flex items-center gap-1 text-xs text-[#C4956A] hover:text-white bg-[#C4956A]/20 hover:bg-[#C4956A] px-3 py-1.5 rounded-lg transition-colors">
                          <Check size={13} /> حفظ
                        </button>
                        <button onClick={() => setEditId(null)}
                          className="flex items-center gap-1 text-xs text-white/50 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                          <X size={13} /> إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <StarDisplay rating={review.rating} />
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{review.text}</p>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => startEdit(review)}
                          className="flex items-center gap-1.5 text-xs text-[#C4956A] hover:text-[#C4956A]/80 transition-colors"
                        >
                          <Pencil size={13} /> تعديل
                        </button>
                        {confirmId === review.id ? (
                          <ConfirmDelete
                            onConfirm={() => handleDelete(review.id)}
                            onCancel={() => setConfirmId(null)}
                          />
                        ) : (
                          <button
                            onClick={() => setConfirmId(review.id)}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={13} /> حذف
                          </button>
                        )}
                      </div>
                    </>
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
