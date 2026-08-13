# الدليل العملي لحفر الصور على الجلد بالفايبر 30W

## التشخيص

النتيجة القديمة كانت تستخدم Threshold محليًا: كل بكسل إما أسود كامل أو أبيض كامل. اللون الوردي المشبع في الملابس يتحول عند حساب الإضاءة إلى رمادي داكن، فتتصل البكسلات السوداء وتظهر الملابس ككتلة فحم بلا طيات.

الجلد لا يستجيب للطاقة كالشاشة؛ في كثير من الأنواع توجد عتبة بين «لا توجد علامة» و«حرق داكن». لذلك تمثيل الدرجات الصحيح يكون بكثافة نقط سوداء منفصلة، لا بتحويل المساحة كلها إلى أسود ولا بتغيير طاقة الليزر لكل درجة.

## الحل المستخدم في V5.8.0

1. عزل الشخص وحماية الشعر والحواف.
2. موازنة الإضاءة محليًا مع حماية الوجه.
3. التحجيم أولًا إلى المقاس الحقيقي و333 DPI.
4. ضغط الظلال حتى تظل أغمق الملابس محتوية على فراغات بيضاء.
5. Stucki error-diffusion لتحويل الرمادي إلى كثافات نقط ثنائية اللون.
6. تعزيز الحواجب والعين والفم وطيات القماش بدون ملء المساحات.
7. حد أقصى محلي لكثافة النقط يمنع أي مربع فحم كامل.
8. إخراج PNG وBMP ثنائي اللون مع DPI الحقيقي.

التحجيم قبل التنقيط خطوة أساسية: لو نُقّطت صورة صغيرة ثم كُبّرت، كل نقطة تتحول إلى مربع كبير متصل بالنقط المجاورة.

## إعداد EZCAD للملف الناتج

| الإعداد | القيمة |
| --- | --- |
| Fixed DPI | ON، ونفس DPI المكتوب في البرنامج |
| Gray | OFF |
| Dither | OFF |
| Lighten | OFF |
| Pixel Power Adjust | OFF |
| Drill Mode | ON |
| Bidirectional Scan | OFF في أول معايرة |
| Pass / Loop | 1 |

لا تستخدم Hatch ولا تعالج الملف مرة أخرى؛ البرنامج سلّم EZCAD خريطة النقط النهائية.

## نقطة بداية للفايبر 30W على جلد محفظة فاتح

هذه ليست قيمة سحرية لكل الجلود. شغّل ملف «اختبار الجلد» على قصاصة من المنتج نفسه:

| المحاولة | Speed | Power | Frequency | DPI | Pass |
| --- | ---: | ---: | ---: | ---: | ---: |
| خفيفة | 3000 mm/s | 8% | 50 kHz | 333 | 1 |
| متوسطة | 3000 mm/s | 12% | 50 kHz | 333 | 1 |
| أقوى | 2500–3000 mm/s | 16% | 50 kHz | 333 | 1 |

- لو النقط متضخمة أو الصورة موحلة: قلّل الطاقة أولًا، أو ارفع السرعة، ولا تزود سواد الملف.
- لو الصورة خفيفة والنقط واضحة منفصلة: ارفع الطاقة تدريجيًا.
- لو الخطوط تتراكب: لا ترفع DPI؛ جرّب 300 DPI أو اختبر Line Interval أكبر.
- ثبّت الفوكس واستواء المحفظة. يمكن تجربة إبعاد بسيط جدًا بعد نجاح المعايرة الأساسية فقط.
- لا تحفر PVC أو جلدًا صناعيًا مجهول التركيب، واستخدم شفط أبخرة وحماية مناسبة.

## لماذا 333 DPI؟

العلاقة هي:

`Line Interval (mm) = 25.4 / DPI`

وبالتالي 333 DPI تعني نحو 0.076 mm بين النقط/السطور. زيادة DPI ليست دائمًا جودة أعلى؛ إذا أصبحت المسافة أصغر من العلامة الفعلية على الجلد، تتداخل الضربات وتتحول الصورة إلى سواد موحل.

## البرامج والخدمات التي تمت مقارنتها

- EZCAD: يدعم Gray وDither وDrill Mode وPixel Power Mapping، لكن لا ينبغي تكرار المعالجة عند استيراد ملف منقّط جاهز.
- LightBurn: Threshold وOrdered وFloyd-Steinberg وStucki وJarvis وNewsprint وHalftone، مع Pass-Through للصور المجهزة مسبقًا.
- PhotoGrav: تنقيط diffusion محسّن حسب الخامة مع تحكم في الكثافة.
- 1-Touch Laser Photo من ULS: يحول الصور إلى single-bit raster ويختار screen حسب الخامة.
- Imag-R: تجهيز صور أونلاين حسب الليزر والخامة مع levels وcontrast وdithering.
- LaserGRBL: تحويل grayscale أو 1-bit dithering؛ يوصي بالتنقيط عندما لا تستجيب الخامة خطيًا للطاقة.
- GIMP: Newsprint clustered-dot ومرشحات الصورة العامة، لكنه يحتاج إعدادًا يدويًا للخامة.

## المصادر الأساسية

- JCZ EZCAD3 Operator Manual — Bitmap, Dither, Drill Mode, Pixel Power: https://www.omglaser.com/wp-content/uploads/2021/07/EZCAD3-User-Manual.pdf
- LightBurn Image Mode: https://docs.lightburnsoftware.com/2.1/Reference/CutSettingsEditor/ImageMode/
- LightBurn Perfect Image Engraving: https://docs.lightburnsoftware.com/2.1/Guides/PerfectImageEngraving/
- LightBurn Interval Test: https://docs.lightburnsoftware.com/2.1/Reference/IntervalTest/
- LaserGRBL Dithering: https://lasergrbl.com/usage/raster-image-import/dithering-tool/
- PhotoGrav: https://www.photograv.com/
- ULS 1-Touch Laser Photo: https://ulsinc.com/support/1-touch-laser.html
- Imag-R: https://imag-r.com/
- Trotec photo engraving: https://www.troteclaser.com/en-us/helpcenter/software/jobcontrol/photo-laser-engraving
- Trotec leather processing: https://www.troteclaser.com/en-us/helpcenter/materials/material-usage-hints/laser-processing-leather
- Fiber leather example and settings reference: https://www.barchlaser.com/fiber-laser-settings-for-natural-leather-engraving/
- Video — complete photo engraving guide: https://www.youtube.com/watch?v=EB40S6AEVwE
- Video — leather with a fiber laser: https://www.youtube.com/watch?v=0CskljdfHPg

## حدود «الحل النهائي»

الخوارزمية الآن تحل مشكلة الملف الأسود وتحافظ على الدرجات كنقط. أما لون وعمق كل نقطة فعليًا فيعتمدان على نوع الجلد وصبغته وطلائه والفوكس والعدسة ومصدر الفايبر؛ لذلك لا توجد قيمة Power واحدة تصلح لكل المحافظ. اختبار الكثافة على قصاصة من نفس المنتج هو آخر خطوة إلزامية قبل الإنتاج.
