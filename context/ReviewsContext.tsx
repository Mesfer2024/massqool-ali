'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Review } from '@/types/review';

function getSecret(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin-secret') || '';
}

async function uploadPhoto(dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
      body: JSON.stringify({ dataUrl, folder: 'reviews' }),
    });
    const data = await res.json();
    return data.url || dataUrl;
  } catch {
    return dataUrl;
  }
}

interface ReviewsContextValue {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => string;
  updateReview: (id: string, data: Partial<Omit<Review, 'id' | 'createdAt'>>) => void;
  deleteReview: (id: string) => void;
}

const ReviewsContext = createContext<ReviewsContextValue>({
  reviews: [],
  addReview: () => '',
  updateReview: () => {},
  deleteReview: () => {},
});

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then((data: Review[]) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {});
  }, []);

  const addReview = useCallback((data: Omit<Review, 'id' | 'createdAt'>): string => {
    const id = crypto.randomUUID();
    const review: Review = { ...data, id, createdAt: new Date().toISOString() };
    setReviews(prev => [review, ...prev]);

    (async () => {
      let finalReview = { ...review };
      if (review.photoDataUrl?.startsWith('data:')) {
        finalReview.photoDataUrl = await uploadPhoto(review.photoDataUrl);
        setReviews(prev => prev.map(r => r.id === id ? finalReview : r));
      }
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', review: finalReview }),
      });
      const result = await res.json();
      if (result.reviews) setReviews(result.reviews);
    })();

    return id;
  }, []);

  const updateReview = useCallback((id: string, data: Partial<Omit<Review, 'id' | 'createdAt'>>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
      body: JSON.stringify({ action: 'update', id, data }),
    })
      .then(r => r.json())
      .then(result => { if (result.reviews) setReviews(result.reviews); })
      .catch(() => {});
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
      body: JSON.stringify({ action: 'delete', id }),
    })
      .then(r => r.json())
      .then(result => { if (result.reviews) setReviews(result.reviews); })
      .catch(() => {});
  }, []);

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() { return useContext(ReviewsContext); }
