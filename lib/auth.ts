export function isAdmin(request: Request): boolean {
  const secret = request.headers.get('x-admin-secret');
  if (!secret) return false;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_SECRET || '';
  return secret === adminPassword;
}
