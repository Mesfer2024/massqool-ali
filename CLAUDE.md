# مصقول (Massqool) — ملف مرجعي للنماذج الذكية

## ما هو هذا المشروع؟

**مصقول (Massqool)** — متجر إلكتروني سعودي للمنتجات الخشبية الحرفية المصنوعة يدويًا.
- **الموقع الحي**: [https://www.massqool.com](https://www.massqool.com)
- **GitHub**: [https://github.com/Mesfer2024/Massqool](https://github.com/Mesfer2024/Massqool)

## التقنيات

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion (أنيميشن)
- Lucide React (أيقونات)
- React Context API (إدارة الحالة)
- لا يوجد قاعدة بيانات — البيانات في `data/products.ts` و localStorage

## هيكل المشروع

```
app/                          # صفحات (App Router)
├── page.tsx                  # الرئيسية
├── layout.tsx                # التخطيط العام
├── about/page.tsx            # من نحن
├── contact/page.tsx          # تواصل معنا
├── custom-order/page.tsx     # طلب مخصص
├── collections/
│   ├── page.tsx              # جميع التصنيفات
│   └── [category]/page.tsx   # تصنيف محدد
├── products/
│   └── [slug]/page.tsx       # تفاصيل منتج
└── admin/                    # لوحة الإدارة
    ├── page.tsx              # تسجيل الدخول
    ├── products/page.tsx     # إدارة المنتجات
    ├── gallery/page.tsx      # إدارة المعرض
    └── reviews/page.tsx      # إدارة التقييمات

components/
├── home/                     # HeroSection, GallerySection, BrandValuesSection,
│                             # CraftsmanshipSection, CustomerReviewsSection,
│                             # WhatsAppCTASection, CollectionsGrid, CustomOrderCTA, SignaturePieces
├── layout/                   # Navbar, Footer, WhatsAppFloat
├── product/                  # ProductCard
├── cart/                     # CartDrawer
└── ui/                       # DataUrlImg, Logo, WhatsAppButton

context/                      # React Contexts
├── LanguageContext.tsx        # AR/EN + RTL/LTR
├── ThemeContext.tsx           # داكن/فاتح
├── CartContext.tsx            # عربة التسوق
├── GalleryContext.tsx         # صور المعرض
├── ProductsContext.tsx        # بيانات المنتجات
└── ReviewsContext.tsx         # التقييمات

data/
├── products.ts               # بيانات المنتجات + التصنيفات + رقم الواتساب
└── translations.ts           # الترجمات

types/
├── product.ts                # أنواع المنتج والتصنيف
└── review.ts                 # أنواع التقييمات
```

## أوامر التشغيل

```powershell
npm install        # تثبيت المكتبات
npm run dev        # تشغيل محلي (localhost:3000)
npm run build      # بناء للإنتاج
```

## النشر على GitHub + Vercel

```powershell
cd C:\Users\mesfer\.verdent\verdent-projects\project-name-masqool-important
git add -A
git commit -m "وصف التحديث"
git push origin main
```

- Vercel مربوط بالـ GitHub ← أي push على `main` ينشر تلقائيًا خلال ~دقيقة
- **لا تنسَ**: ملفات `.env*` مستثناة من Git — متغيرات البيئة تُضبط في Vercel Dashboard

## ملاحظات مهمة للنماذج

1. **اللغة ثنائية**: الموقع يدعم العربية (RTL) والإنجليزية (LTR) عبر `LanguageContext`
2. **لا يوجد backend**: الطلبات والاستفسارات عبر واتساب مباشرة
3. **البيانات محلية**: المنتجات في `data/products.ts`، بيانات الأدمن في localStorage
4. **الأدمن**: بيانات الدخول في `.env.local` (لا تكتبها في الكود أبدًا)
5. **الصور**: في `public/media/images/`، والمرفوعة عبر الأدمن تُحفظ كـ base64 في localStorage
6. **التصنيفات**: `wall-clocks` | `lamps` | `side-tables` | `signature`
7. **مجلد masqool/**: مجلد قديم (مُتجاهل في .gitignore) — لا تستخدمه

## الأخطاء الشائعة — تجنبها

- **لا ترفع `.env.local`** على GitHub
- **لا تعدل مجلد `masqool/`** — هو نسخة قديمة
- **لا تنسَ** أن Next.js هنا إصدار 16 (ليس 13 أو 14) — راجع `node_modules/next/dist/docs/` عند الشك
- **مسارات الصور** تبدأ بـ `/media/images/` (بدون `public/`)

راجع أيضًا: `AGENTS.md` و `DOCUMENTATION.md`
