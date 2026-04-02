'use client';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  // نسب الصورة الجديدة: 2304 × 1844
  const heights: Record<string, number> = { sm: 110, md: 180, lg: 260 };
  const h = heights[size];
  const w = Math.round(h * (2304 / 1844));

  return (
    <Link href="/" className="inline-flex items-center select-none">
      <Image
        src="/media/logo1.png"
        alt="Massqool | مصقول"
        width={w}
        height={h}
        className="object-contain"
        priority
      />
    </Link>
  );
}
