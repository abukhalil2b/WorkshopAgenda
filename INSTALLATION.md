# دليل التثبيت / Installation Guide

## العربية (Arabic)

متطلبات تمهيدية
- Node.js (يوصى باستخدام Node LTS، مثال: 18 أو أحدث). استخدم nvm لتثبيت النسخة الصحيحة: `nvm use`
- npm أو yarn أو pnpm

الاستنساخ والتثبيت
```bash
git clone https://github.com/abukhalil2b/WorkshopAgenda.git
cd WorkshopAgenda
npm install
# أو
# yarn
# أو
# pnpm install
```

تشغيل بيئة التطوير
```bash
npm run dev
# أو
npm start
```
ماذا تفعل هذه الأوامر: تشغيل تطبيق Electron في وضع التطوير مع إعادة التحميل التلقائي.

بناء نسخة الإنتاج
```bash
npm run build
```
نتيجة البناء (مثلاً مجلد `dist/` أو `build/`) سيتم إنشاؤها حسب إعدادات المشروع.

تجهيز الحزم (مثال باستخدام electron-builder)
```bash
# مثال: لصنع مثبت Windows (NSIS) أو برنامج macOS .dmg/.pkg
npm run dist
# أو مفصل:
npm run dist:win
npm run dist:mac
```

ملاحظات مهمة
- إذا كان التطبيق يتطلب توقيعًا (macOS) أو توقيع مثبت (Windows)، يجب إعداد مفاتيح التوقيع أو استخدام CI لتوقيع الحزم.
- إذا كانت الواجهة تستخدم NodeIntegration في الrenderer، ففكر في استخدام `contextBridge` و`preload` لحماية التطبيق.
- لمشاكل شائعة: تأكد من تحديث Node وإعادة تثبيت الحزم (`rm -rf node_modules && npm ci`).

الاتصال والدعم
للمساعدة، افتح issue أو اتصل بالمطور: @abukhalil2b

---

## English

Prerequisites
- Node.js (recommend LTS, e.g. Node 18+). Use nvm if needed: `nvm use`
- npm, yarn, or pnpm

Clone & install
```bash
git clone https://github.com/abukhalil2b/WorkshopAgenda.git
cd WorkshopAgenda
npm install
# or
# yarn
# or
# pnpm install
```

Run in development
```bash
npm run dev
# or
npm start
```
This runs the Electron app in development mode with hot reload (if configured).

Build production
```bash
npm run build
```
Build artifacts are typically in `dist/` or `build/` depending on your config.

Package for distribution (example with electron-builder)
```bash
npm run dist
# or specific targets
npm run dist:win
npm run dist:mac
```

Notes
- macOS: you likely need to sign and notarize builds for distribution outside the App Store.
- Windows: consider NSIS for installer generation and code-signing for executables.
- Security: avoid enabling NodeIntegration in renderer; prefer `contextBridge` and a secure preload script.
- Troubleshooting: if you hit dependency errors try `rm -rf node_modules package-lock.json && npm ci`.

Contact
Open an issue or contact the maintainer: @abukhalil2b


D — Example package.json scripts to include (adjust as needed)
If you don’t already have packaging scripts, consider these entries in package.json:

```json
{
  "scripts": {
    "dev": "electron .",
    "start": "electron .",
    "build": "webpack --mode production && electron-builder --dir",
    "dist": "electron-builder",
    "dist:win": "electron-builder --win",
    "dist:mac": "electron-builder --mac"
  }
}
```

(Adapt `build`/`dev` commands to your actual bundler: webpack/parcel/vite/electron-forge).