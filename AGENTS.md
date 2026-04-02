<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Massqool — Agent Instructions

- **Project**: Massqool (مصقول) — Saudi handcrafted woodwork e-commerce store
- **Live site**: https://www.massqool.com
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **No backend/database** — products in `data/products.ts`, admin data in localStorage
- **Bilingual**: Arabic (RTL) + English (LTR) via `context/LanguageContext.tsx`
- **Deployment**: GitHub → Vercel auto-deploy on push to `main`
- **Admin credentials**: in `.env.local` (never hardcode)
- **Old `masqool/` folder**: ignored in `.gitignore` — do not use
- **Image paths**: start with `/media/images/` (not `/public/media/images/`)
- See `CLAUDE.md` and `DOCUMENTATION.md` for full details
