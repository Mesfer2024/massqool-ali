import { getGalleryItems, setGalleryItems, getGalleryCategories, setGalleryCategories } from '@/lib/storage';
import { isAdmin } from '@/lib/auth';

export async function GET() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
  ]);
  return Response.json({ items, categories });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === 'addItem') {
    const items = await getGalleryItems();
    const newItem = { 
      id: crypto.randomUUID(), 
      images: body.images || [body.src], 
      category: body.category || '', 
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      price: body.price,
      originalPrice: body.originalPrice,
      dimensionsAr: body.dimensionsAr,
      dimensionsEn: body.dimensionsEn,
      descriptionAr: body.descriptionAr,
      descriptionEn: body.descriptionEn,
      isNew: body.isNew,
      isOnSale: body.isOnSale,
    };
    const updated = [newItem, ...items];
    await setGalleryItems(updated);
    return Response.json({ ok: true, items: updated });
  }

  if (action === 'updateItem') {
    const items = await getGalleryItems();
    const { id, ...updates } = body;
    delete updates.action;
    const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
    await setGalleryItems(updated);
    return Response.json({ ok: true, items: updated });
  }

  if (action === 'removeItem') {
    const items = await getGalleryItems();
    const updated = items.filter(i => i.id !== body.id);
    await setGalleryItems(updated);
    return Response.json({ ok: true, items: updated });
  }

  if (action === 'updateItemCategory') {
    const items = await getGalleryItems();
    const updated = items.map(i => i.id === body.id ? { ...i, category: body.category } : i);
    await setGalleryItems(updated);
    return Response.json({ ok: true, items: updated });
  }

  if (action === 'updateItemSold') {
    const items = await getGalleryItems();
    const updated = items.map(i => i.id === body.id ? { ...i, isSold: body.isSold } : i);
    await setGalleryItems(updated);
    return Response.json({ ok: true, items: updated });
  }

  if (action === 'addCategory') {
    const categories = await getGalleryCategories();
    const newCat = { key: crypto.randomUUID().slice(0, 8), labelAr: body.labelAr, labelEn: body.labelEn };
    const updated = [...categories, newCat];
    await setGalleryCategories(updated);
    return Response.json({ ok: true, categories: updated });
  }

  if (action === 'removeCategory') {
    const [categories, items] = await Promise.all([getGalleryCategories(), getGalleryItems()]);
    const updatedCats = categories.filter(c => c.key !== body.key);
    const updatedItems = items.map(i => i.category === body.key ? { ...i, category: '' } : i);
    await Promise.all([setGalleryCategories(updatedCats), setGalleryItems(updatedItems)]);
    return Response.json({ ok: true, categories: updatedCats, items: updatedItems });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}
