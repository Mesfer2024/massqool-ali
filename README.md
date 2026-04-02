# مصقول | Massqool

متجر إلكتروني سعودي للمنتجات الخشبية الحرفية المصنوعة يدويًا — ساعات حائط، مصابيح، طاولات جانبية، ومنحوتات.

**الموقع الحي**: [https://www.massqool.com](https://www.massqool.com)

---

## التقنيات

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** للتنسيق
- **Framer Motion** للأنيميشن
- **Lucide React** للأيقونات
- دعم كامل للعربية (RTL) والإنجليزية (LTR)

## التشغيل محليًا

```powershell
npm install
npm run dev
```

يعمل على: `http://localhost:3000`

## النشر

المشروع مربوط بـ **Vercel** عبر GitHub — أي push على `main` ينشر تلقائيًا.

```powershell
git add -A
git commit -m "وصف التحديث"
git push origin main
```

## متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```
NEXT_PUBLIC_ADMIN_USERNAME=اسم_المستخدم
NEXT_PUBLIC_ADMIN_PASSWORD=كلمة_المرور
```

> لا ترفع هذا الملف على GitHub — هو مُستثنى تلقائيًا في `.gitignore`

## التوثيق التفصيلي

راجع ملف [`DOCUMENTATION.md`](./DOCUMENTATION.md) للتوثيق الكامل: هيكل المشروع، كيفية إضافة منتجات، التصنيفات، لوحة الإدارة، وغيرها.
