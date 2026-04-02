import { getReviews, setReviews } from '@/lib/storage';
import { isAdmin } from '@/lib/auth';
import { Review } from '@/types/review';

export async function GET() {
  const reviews = await getReviews();
  return Response.json(reviews);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;
  const reviews = await getReviews();

  if (action === 'add') {
    const review: Review = {
      ...body.review,
      id: body.review.id || crypto.randomUUID(),
      createdAt: body.review.createdAt || new Date().toISOString(),
    };
    const updated = [review, ...reviews];
    await setReviews(updated);
    return Response.json({ ok: true, review, reviews: updated });
  }

  // update and delete require admin
  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (action === 'update') {
    const { id, data } = body;
    const updated = reviews.map(r => r.id === id ? { ...r, ...data } : r);
    await setReviews(updated);
    return Response.json({ ok: true, reviews: updated });
  }

  if (action === 'delete') {
    const { id } = body;
    const updated = reviews.filter(r => r.id !== id);
    await setReviews(updated);
    return Response.json({ ok: true, reviews: updated });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}
