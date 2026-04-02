import type { Metadata } from "next";
import { Cormorant_Garamond, Cairo, Inter } from 'next/font/google';
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { GalleryProvider } from "@/context/GalleryContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CartDrawer from "@/components/cart/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.massqool.com"),
  title: "مصقول | Massqool — فن خشبي يُصنع ليبقى",
  description: "مصقول — فن خشبي يدوي الصنع لمساحات خالدة. ساعات حائط، مصابيح، طاولات، وقطع فنية حصرية.",
  keywords: "مصقول, خشب, حرفي, ساعة حائط, مصباح, طاولة جانبية, فن خشبي, Massqool, wood art, handcrafted",
  openGraph: {
    title: "مصقول | Massqool",
    description: "فن خشبي يُصنع ليبقى",
    images: ["/media/images/masqool-hero-05.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`h-full antialiased ${cormorant.variable} ${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('masqool-theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark')})()` }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink dark:bg-[#1A1714] dark:text-[#E8E2D9]" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <ReviewsProvider>
              <GalleryProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <WhatsAppFloat />
                <CartDrawer />
              </CartProvider>
              </GalleryProvider>
            </ReviewsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
