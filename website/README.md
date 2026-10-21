# RigForge Official Showcase & Download Website

A modern, high-performance landing page and software distribution website for **RigForge** (Windows Bulk Installer & System Updater), built with:
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** for clean utility design
- **Motion (Framer Motion)** for smooth spring animations and micro-interactions
- **Lucide Icons** for sharp, scalable SVG iconography
- **Authentic App Catalog**: Includes all 51 official applications and their high-resolution logos

---

## 🚀 Running Locally

To run the website locally on your computer:

```bash
# 1. Navigate to the website directory
cd website

# 2. Start the dev server
npm run dev
```

Or simply double-click `LaunchWebsite.bat` in the project root!

---

## 📦 Building for Production

```bash
npm run build
```
The optimized static build will be generated in `website/dist/`.

---

## 🌐 How to Deploy for Free

### Option 1: Cloudflare Pages (Recommended)
1. Push this repository to GitHub or run `npx wrangler pages deploy dist`.
2. Connect your repository to Cloudflare Pages.
3. Build command: `npm run build`
4. Build output directory: `dist`

### Option 2: Vercel
1. Import the repository on Vercel.
2. Root directory: `website`
3. Framework Preset: `Vite`
4. Click **Deploy**.

### Option 3: GitHub Pages
1. In `vite.config.ts`, set `base: './'`.
2. Run `npm run build` and deploy the `dist/` folder via GitHub Actions or the `gh-pages` branch.
