'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') router.replace('/admin/reviews');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === 'ALwaked99%') {
        localStorage.setItem('admin-auth', 'true');
        router.push('/admin/reviews');
      } else {
        setError('كلمة المرور غير صحيحة');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0D0C0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
            لوحة التحكم
          </h1>
          <p className="text-white/40 text-sm">Massqool Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="text-white/60 text-sm mb-2 block" style={{ fontFamily: "'Cairo', sans-serif" }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C4956A] transition-colors text-sm"
              placeholder="••••••••"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            />
            {error && <p className="text-red-400 text-xs mt-2 text-right">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C4956A] hover:bg-[#8B6245] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors duration-300 text-sm"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {loading ? '...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
