# Fiber Auto Max V4.1 — EZCAD 30W

نسخة جاهزة للرفع على GitHub Pages بدون localhost.

## الملفات المطلوبة في Root الريبو

- index.html
- app.js
- styles.css
- .nojekyll
- README.md

## تشغيل على GitHub Pages

1. اعمل Repository جديد على GitHub باسم مثلا:
   `fiber-auto-max-ezcad`
2. ارفع الملفات الموجودة داخل هذا المجلد مباشرة في Root الريبو، وليس داخل فولدر فرعي.
3. افتح Settings من الريبو.
4. من القائمة الجانبية افتح Pages.
5. في Build and deployment اختر:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /root
6. اضغط Save.
7. انتظر عدة دقائق ثم افتح الرابط الذي يظهر لك في GitHub Pages.

## ملاحظات مهمة

- المشروع Static: HTML + CSS + JS فقط.
- لا يحتاج Python بعد الرفع على GitHub Pages.
- لا ترفع صور العملاء على GitHub؛ الصور تعالج داخل المتصفح عند المستخدم.
- أول تشغيل يحتاج إنترنت لتحميل مكتبات CDN المستخدمة في الصفحة.
- أفضل تصدير لـ EZCAD هو BMP من داخل البرنامج.

