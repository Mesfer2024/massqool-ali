import { put } from '@vercel/blob';
import { isAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { dataUrl, folder = 'images' } = await request.json();

  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return Response.json({ error: 'Invalid data URL' }, { status: 400 });
  }

  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    return Response.json({ error: 'Invalid base64 format' }, { status: 400 });
  }

  const contentType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  const ext = contentType.split('/')[1] || 'jpeg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, buffer, {
    access: 'public',
    contentType,
  });

  return Response.json({ url: blob.url });
}
