# AR Food QR

Upload 3D food models, generate QR codes, and let customers view dishes in augmented reality on their phones.

## Features

- 🏪 Multi-restaurant support with categories
- 📦 Upload 3D models (GLB, GLTF, USDZ)
- 📱 Native AR viewing (iOS Quick Look / Android Scene Viewer)
- 🔗 Unique QR codes per menu item
- ☁️ Deploys on Vercel with Blob storage

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Vercel Blob

## Setup

```bash
npm install
npx prisma generate
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `BLOB_READ_WRITE_TOKEN`
4. Deploy!

## Environment Variables

```env
POSTGRES_URL=
POSTGRES_PRISMA_URL=
BLOB_READ_WRITE_TOKEN=
```
