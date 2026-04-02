'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Review } from '@/types/review';

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('masqool-reviews');
      if (stored) setReviews(JSON.parse(stored));
    } catch {}
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('masqool-reviews', JSON.stringify(reviews));
  }, [reviews, isInitialized]);

  const addReview = (data: Omit<Review, 'id' | 'createdAt'>): string => {
    const id = crypto.randomUUID();
    const review: Review = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [review, ...prev]);
    return id;
  };

  const updateReview = (id: string, data: Partial<Omit<Review, 'id' | 'createdAt'>>) => {
    setReviews((prev) => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteReview = (id: string) =>
    setReviews((prev) => prev.filter((r) => r.id !== id));

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
