# توثيق موقع مصقول | Massqool Website Documentation

---

## نظرة عامة

**مصقول** متجر إلكتروني متخصص في المنتجات الخشبية الحرفية المصنوعة يدويًا (ساعات حائط، مصابيح، طاولات جانبية، منحوتات). الموقع مبني بـ **Next.js 15** مع دعم كامل للغتين العربية والإنجليزية.

---

## التقنيات المستخدمة

| التقنية | الوصف |
|---------|-------|
| Next.js 15 (App Router) | إطار العمل الرئيسي |
| TypeScript | لغة البرمجة |
| Tailwind CSS | التنسيق والتصميم |
| React Context API | إدارة الحالة العامة |

---

## هيكل المشروع

```
app/                              # صفحات التطبيق (App Router)
├── page.tsx                      # الصفحة الرئيسية
├── layout.tsx                    # التخطيط العام (Providers + Fonts)
├── about/page.tsx                # صفحة من نحن
├── contact/page.tsx              # صفحة التواصل
├── custom-order/page.tsx         # صفحة الطلب المخصص
├── collections/                  # صفحات التصنيفات
│   ├── page.tsx                  # جميع التصنيفات
│   └── [category]/page.tsx       # تصنيف محدد (wall-clocks, lamps...)
├── products/
│   └── [slug]/page.tsx           # صفحة تفاصيل المنتج
└── admin/                        # لوحة الإدارة
    ├── page.tsx                  # تسجيل الدخول
    ├── products/page.tsx         # إدارة المنتجات
    ├── gallery/page.tsx          # إدارة المعرض
    └── reviews/page.tsx          # إدارة التقييمات

components/                       # المكونات
├── home/                         # مكونات الصفحة الرئيسية
│   ├── HeroSection.tsx           # قسم الهيرو
│   ├── GallerySection.tsx        # معرض المنتجات + فلترة
│   ├── CraftsmanshipSection.tsx  # قسم الحرفية
│   ├── BrandValuesSection.tsx    # قيم العلامة التجارية
│   ├── CustomerReviewsSection.tsx # تقييمات العملاء
│   ├── WhatsAppCTASection.tsx    # دعوة واتساب
│   ├── CollectionsGrid.tsx       # شبكة التصنيفات
│   ├── CustomOrderCTA.tsx        # دعوة الطلب المخصص
│   └── SignaturePieces.tsx       # قطع التوقيع
├── layout/
│   ├── Navbar.tsx                # شريط التنقل
│   ├── Footer.tsx                # التذييل
│   └── WhatsAppFloat.tsx         # زر واتساب العائم
├── product/
│   └── ProductCard.tsx           # بطاقة المنتج
├── cart/
│   └── CartDrawer.tsx            # درج عربة التسوق
└── ui/                           # مكونات واجهة عامة
    ├── DataUrlImg.tsx            # عرض صور base64
    ├── Logo.tsx                  # شعار الموقع
    └── WhatsAppButton.tsx        # زر واتساب

context/                          # React Contexts
├── LanguageContext.tsx            # إدارة اللغة (AR/EN) + اتجاه RTL/LTR
├── ThemeContext.tsx               # إدارة الثيم (داكن/فاتح)
├── CartContext.tsx                # عربة التسوق
├── ProductsContext.tsx            # بيانات المنتجات (CRUD عبر الأدمن)
├── GalleryContext.tsx             # بيانات المعرض
└── ReviewsContext.tsx             # التقييمات

data/
├── products.ts                   # *** بيانات المنتجات (الأهم) ***
└── translations.ts               # ترجمات النصوص

types/
├── product.ts                    # أنواع TypeScript للمنتج
└── review.ts                     # أنواع التقييمات

public/
└── media/images/                 # صور المنتجات
```

---

## صفحات الموقع

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | Hero + معرض + قيم العلامة + تقييمات |
| التصنيفات | `/collections` | عرض جميع التصنيفات |
| تصنيف محدد | `/collections/wall-clocks` | منتجات تصنيف معين |
| تفاصيل منتج | `/products/sahara-wall-clock` | صفحة منتج بالـ slug |
| من نحن | `/about` | قصة العلامة |
| تواصل معنا | `/contact` | معلومات التواصل |
| طلب مخصص | `/custom-order` | نموذج الطلب المخصص |
| لوحة الإدارة | `/admin` | إدارة المعرض والتقييمات |

---

## نموذج بيانات المنتج

```typescript
// types/product.ts
export interface Product {
  id: string;                    // معرف فريد (نصي)
  slug: string;                  // رابط المنتج (مثال: "sahara-wall-clock")
  nameAr: string;                // اسم المنتج بالعربية
  nameEn: string;                // اسم المنتج بالإنجليزية
  category: ProductCategory;     // التصنيف: 'wall-clocks' | 'lamps' | 'side-tables' | 'signature'
  price: number;                 // السعر بالريال السعودي
  images: string[];              // مصفوفة مسارات الصور
  descriptionAr: string;         // الوصف بالعربية
  descriptionEn: string;         // الوصف بالإنجليزية
  isSignature: boolean;          // هل هو من قطع التوقيع؟
  isFeatured: boolean;           // هل يظهر في المعرض الرئيسي؟
  dimensions?: { ar: string; en: string }; // الأبعاد (اختياري)
  isPlaceholderDimensions?: boolean;       // هل الأبعاد مؤقتة؟
  materials?: string;            // المواد المستخدمة (اختياري)
  whatsappInquiryText: string;   // نص رسالة واتساب الجاهزة
}
```

### التصنيفات المتاحة

| القيمة | الاسم العربي | الاسم الإنجليزي |
|--------|-------------|----------------|
| `wall-clocks` | ساعات الحائط | Wall Clocks |
| `lamps` | المصابيح | Lamps |
| `side-tables` | الطاولات الجانبية | Side Tables |
| `signature` | قطع التوقيع | Signature Pieces |

---

## كيفية إضافة منتج جديد في المعرض

### الخطوة 1 — أضف صورة المنتج

ضع صورة المنتج في المجلد:
```
masqool/public/media/images/
```
مثال: `masqool/public/media/images/my-new-product-01.jpeg`

> **ملاحظة:** يمكن وضع أكثر من صورة لنفس المنتج (الأولى هي الرئيسية).

---

### الخطوة 2 — افتح ملف المنتجات

```
masqool/data/products.ts
```

---

### الخطوة 3 — أضف كائن المنتج الجديد

في نهاية مصفوفة `products`، أضف منتجك قبل القوس المغلق `]`:

```typescript
{
  id: '9',                                    // رقم تسلسلي (الأخير كان 8)
  slug: 'my-new-product',                     // رابط المنتج - بالإنجليزية فقط، بدون مسافات
  nameAr: 'اسم المنتج بالعربية',
  nameEn: 'My New Product Name',
  category: 'wall-clocks',                    // اختر من: wall-clocks | lamps | side-tables | signature
  price: 1200,                                // السعر بالريال السعودي
  images: [
    '/media/images/my-new-product-01.jpeg',   // الصورة الرئيسية
    '/media/images/my-new-product-02.jpeg',   // صورة ثانية (اختياري)
    '/media/images/my-new-product-03.jpeg',   // صورة ثالثة (اختياري)
  ],
  descriptionAr: 'وصف المنتج بالعربية بشكل مفصل.',
  descriptionEn: 'Detailed product description in English.',
  isSignature: false,                         // true = يظهر في قسم قطع التوقيع
  isFeatured: true,                           // true = يظهر في معرض الصفحة الرئيسية
  dimensions: { ar: '40 × 40 × 5 سم', en: '40 × 40 × 5 cm' },
  isPlaceholderDimensions: false,             // false = الأبعاد حقيقية
  materials: 'خشب الجوز الطبيعي',
  whatsappInquiryText: 'مرحباً، أودّ الاستفسار عن [اسم المنتج] - كود: MYPRODUCT-09',
},
```

---

### مثال كامل — إضافة ساعة حائط جديدة

```typescript
// في نهاية مصفوفة products في data/products.ts
{
  id: '9',
  slug: 'rimal-wall-clock',
  nameAr: 'ساعة الرمال',
  nameEn: 'Rimal Wall Clock',
  category: 'wall-clocks',
  price: 1950,
  images: [
    '/media/images/rimal-clock-01.jpeg',
    '/media/images/rimal-clock-02.jpeg',
  ],
  descriptionAr: 'ساعة حائط مستوحاة من أمواج الرمال. منحوتة يدويًا من خشب الزيتون بتفاصيل دقيقة.',
  descriptionEn: 'A wall clock inspired by sand dunes. Hand-carved from olive wood with fine details.',
  isSignature: false,
  isFeatured: true,
  dimensions: { ar: '55 × 55 × 5 سم', en: '55 × 55 × 5 cm' },
  isPlaceholderDimensions: false,
  materials: 'خشب الزيتون، زجاج مقوى',
  whatsappInquiryText: 'مرحباً، أودّ الاستفسار عن ساعة الرمال - كود: RIMAL-09',
},
```

---

### نقاط مهمة عند الإضافة

| النقطة | التفاصيل |
|--------|---------|
| `id` | يجب أن يكون فريدًا، استمر من آخر رقم |
| `slug` | بالإنجليزية فقط، بدون مسافات، استخدم `-` بدلاً منها |
| `images` | مسار الصورة يبدأ بـ `/media/images/` |
| `isFeatured: true` | يظهر في معرض الصفحة الرئيسية |
| `isSignature: true` | يظهر في قسم "قطع التوقيع" |
| `whatsappInquiryText` | يُرسل تلقائيًا عند الضغط على زر واتساب |

---

## إضافة تصنيف جديد

إذا أردت إضافة تصنيف جديد غير الموجود، عليك تعديل ملفين:

**1. في `types/product.ts`** — أضف التصنيف الجديد:
```typescript
export type ProductCategory = 'wall-clocks' | 'lamps' | 'side-tables' | 'signature' | 'new-category';
```

**2. في `data/products.ts`** — أضفه لمصفوفة `categories`:
```typescript
{
  id: 'new-category',
  nameAr: 'اسم التصنيف بالعربية',
  nameEn: 'Category Name',
  image: '/media/images/category-cover.jpeg',
  href: '/collections/new-category',
},
```

---

## معلومات التواصل (واتساب)

رقم الواتساب محفوظ في أعلى ملف `data/products.ts`:

```typescript
export const WHATSAPP_NUMBER = '+966565858605';
export const WHATSAPP_DISPLAY = '0565858605';
```

لتغيير الرقم، عدّل هذين المتغيرين فقط.

---

## تشغيل المشروع محليًا

```powershell
cd masqool
npm install
npm run dev
```

الموقع يعمل على: `http://localhost:3000`

---

## النشر

### الاستضافة
- **GitHub**: [https://github.com/Mesfer2024/Massqool](https://github.com/Mesfer2024/Massqool)
- **Vercel**: مربوط تلقائياً بالـ GitHub — أي push على `main` ينشر الموقع تلقائياً
- **الموقع الحي**: [https://www.massqool.com](https://www.massqool.com)

### لنشر تحديث
```powershell
cd C:\Users\mesfer\.verdent\verdent-projects\project-name-masqool-important
git add -A
git commit -m "وصف التحديث"
git push origin main
```
Vercel ينشر تلقائياً خلال دقيقة تقريباً.

---

## لوحة الإدارة (Admin Panel)

### الدخول
- **الرابط**: `massqool.com/admin`
- **اسم المستخدم**: محفوظ في متغير البيئة `NEXT_PUBLIC_ADMIN_USERNAME`
- **كلمة المرور**: محفوظة في متغير البيئة `NEXT_PUBLIC_ADMIN_PASSWORD`

> **هام:** لا تكتب بيانات الدخول في الكود أو التوثيق. استخدم ملف `.env.local` محلياً ومتغيرات البيئة في Vercel.

### أيقونة الأدمن
بعد تسجيل الدخول، تظهر أيقونة ⚙️ في شريط التنقل العلوي للوصول السريع للوحة التحكم.

### صفحات الإدارة
| الصفحة | الرابط | الوظيفة |
|--------|--------|---------|
| إدارة المنتجات | `/admin/products` | إضافة / تعديل / حذف المنتجات |
| إدارة المعرض | `/admin/gallery` | رفع / حذف صور المعرض + تصنيفها |
| إدارة التعليقات | `/admin/reviews` | حذف تعليقات العملاء |

### ملاحظات الأمان
- صفحات الأدمن محمية بفحص تسجيل الدخول عبر localStorage
- شريط التنقل والفوتر وزر الواتساب يختفون تلقائياً في صفحات الأدمن
- البيانات تُحفظ في localStorage المتصفح (لكل جهاز بيانات مستقلة)

---

## ملاحظات إضافية

- الموقع يدعم **RTL** للعربية و**LTR** للإنجليزية تلقائيًا عبر `LanguageContext`.
- جميع الطلبات والاستفسارات تتم عبر **واتساب** مباشرة (لا يوجد نظام دفع مدمج).
- لوحة الإدارة على `/admin` تتيح إدارة المنتجات والمعرض والتقييمات.
- صور المنتجات المرفوعة عبر الأدمن تُحفظ كـ base64 في localStorage (حد ~5-10MB).
