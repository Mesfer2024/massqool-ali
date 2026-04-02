import { getProducts, setProducts } from '@/lib/storage';
import { isAdmin } from '@/lib/auth';
import { Product } from '@/types/product';

export async function GET() {
  const products = await getProducts();
  return Response.json(products);
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;
  const products = await getProducts();

  if (action === 'add') {
    const product: Product = body.product;
    const updated = [product, ...products];
    await setProducts(updated);
    return Response.json({ ok: true, products: updated });
  }

  if (action === 'update') {
    const { id, data } = body;
    const updated = products.map(p => p.id === id ? { ...p, ...data } : p);
    await setProducts(updated);
    return Response.json({ ok: true, products: updated });
  }

  if (action === 'remove') {
    const { id } = body;
    const updated = products.filter(p => p.id !== id);
    await setProducts(updated);
    return Response.json({ ok: true, products: updated });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}
