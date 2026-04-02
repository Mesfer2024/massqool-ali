'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') router.replace('/admin/products');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('admin-auth', 'true');
        window.dispatchEvent(new Event('admin-auth-change'));
        router.push('/admin/products');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    }, 400);
  };

  const font = "'Cairo', sans-serif";

  return (
    <div className="min-h-screen bg-[#0D0C0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: font }}>
            لوحة التحكم
          </h1>
          <p className="text-white/40 text-sm">Massqool Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="text-white/60 text-sm mb-2 block" style={{ fontFamily: font }}>
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] transition-colors text-sm"
              placeholder="admin"
              style={{ fontFamily: font }}
            />
          </div>

          <div>
            <label className="text-white/60 text-sm mb-2 block" style={{ fontFamily: font }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] transition-colors text-sm"
              placeholder="••••••••"
              style={{ fontFamily: font }}
            />
            {error && <p className="text-red-400 text-xs mt-2 text-right">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C4956A] hover:bg-[#8B6245] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors duration-300 text-sm"
            style={{ fontFamily: font }}
          >
            {loading ? '...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
