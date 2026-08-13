# الدليل العملي العميق لرسم وحفر البورتريه على الجلد بالفايبر 30W

## لماذا كانت الصورة تتحول إلى فحم؟

الصورة الملونة الداكنة لا تصلح للتحويل بعتبة واحدة. الفستان أو الشعر الداكن يتحول إلى مساحة سوداء متصلة، ثم تكبر علامة الليزر على الجلد وتتداخل النقاط أو الخطوط، فتضيع الطيات والوجه. كما أن الجلد لا يستجيب للطاقة مثل الشاشة: نوع الجلد والصبغة والطلاء والفوكس والطاقة يغيرون حجم العلامة واستجابة الدرجات.

الصورة المرجعية المطلوبة ليست Photo Dither فقط. هي رسم بورتريه بخطوط قليلة واضحة، مع تهشير محدود في الملابس والشعر وفراغات بيضاء كثيرة. أبحاث رسم البورتريه تصف الأسلوب نفسه بأنه خطوط متناثرة قليلة ومناطق مظللة قليلة تحفظ هوية الشخص.

## الحل المستخدم في V7.0

1. عزل الشخص وقص الخلفية مع حماية الشعر.
2. موازنة الإضاءة محليًا وحماية الوجه من الظلال القاسية.
3. التحجيم إلى المقاس وDPI النهائيين قبل إنشاء أي خط أو نقطة.
4. `AI Line-Art` يستخرج الخطوط الدلالية من الصورة. يعمل محليًا داخل المتصفح بعد تنزيل الموديل.
5. عند تعذر AI يعمل XDoG متعدد المقاييس مع Non-Maximum Suppression وHysteresis لإنتاج خطوط نظيفة بدل Threshold.
6. ترقيق الخطوط مع الحفاظ على اتصال الحواف.
7. إضافة تهشير قلم خفيف يتبع اتجاه البنية المحلية؛ المناطق الداكنة تأخذ خطوطًا إضافية بدل أن تصبح بقعة سوداء.
8. حماية الوجه تقلل التهشير داخله وتحتفظ بخطوط العين والحاجب والأنف والفم.
9. `Anti-Charcoal Guard` يزيل قلب أي كتلة سميكة، يقيس مربعات 2×2 المصمتة، ويضع حدًا لتغطية كل منطقة صغيرة.
10. منحنى معايرة الجلد يحول الدرجة المطلوبة إلى كثافة حفر تعوض الاستجابة المقاسة.

## الاختيار المناسب داخل البرنامج

| الاختيار | الاستخدام |
| --- | --- |
| AI Wallet Sketch | الأقرب لصورة المحفظة المرجعية؛ الاختيار الافتراضي |
| XDoG Wallet Sketch | نفس الفكرة بدون تنزيل موديل Line-Art |
| Clean Contour | خطوط خفيفة جدًا، مناسب للجلد سريع الاسوداد |
| Etched Crosshatch | تهشير أوضح للملابس والشعر |
| Ultra Photo | صورة فوتوغرافية منقطة، وليس شكل الرسم المرجعي |

قيمة بداية جيدة للصورة المرجعية: قوة الخطوط 8، التهشير 4، الحماية من الفحم 9، قوة الأسود 5. إذا زاد السواد، ارفع الحماية أولًا وخفّض التهشير، ولا ترفع DPI عشوائيًا.

## المعايرة الفيزيائية الإلزامية

1. نزّل اختبار المسافة 600 DPI واحفره على قصاصة من نفس المحفظة.
2. بالمكبر اختر أصغر مسافة تظل فيها الخطوط والنقط منفصلة. يحسب البرنامج `DPI = 25.4 / المسافة بالملليمتر`.
3. نزّل كارت 0–70% عند DPI المختار واحفره بنفس Power وSpeed وFrequency وFocus.
4. صوّر الكارت عموديًا بإضاءة موزعة وارفعه.
5. احفظ البريسيت؛ سيمنع البرنامج تجاوز أقصى كثافة مفيدة ويعكس منحنى الحرق.

LightBurn يوضح أن أفضل Line Interval يجعل خطوط الحفر تتلامس بلا تداخل أو فراغ، وأن Dot Width Correction يعتمد على عرض العلامة الفعلي والخامة. لذلك 600 أو 800 DPI لا يعنيان تلقائيًا تفاصيل أفضل؛ إذا كانت علامة الليزر أعرض من المسافة، ستحصل على حرق أغمق وأبطأ بلا معلومات إضافية.

## إعداد EZCAD

| الإعداد | القيمة |
| --- | --- |
| Fixed DPI | ON، نفس DPI الموجود في الملف |
| Drill Mode | ON |
| Gray | OFF |
| Dither | OFF |
| Lighten | OFF |
| Pixel Power Adjust | OFF |
| Bidirectional Scan | OFF في أول اختبار |
| Pass / Loop | 1 |

لا تستخدم Hatch ولا Dither مرة ثانية. الملف ثنائي اللون ويحمل الخطوط أو النقط النهائية بالفعل.

## نقطة بداية حذرة لفايبر 30W

| الاختبار | Speed | Power | Frequency | DPI | Loop |
| --- | ---: | ---: | ---: | ---: | ---: |
| خفيف | 3000 mm/s | 8% | 50 kHz | من اختبار المسافة | 1 |
| متوسط | 3000 mm/s | 12% | 50 kHz | من اختبار المسافة | 1 |
| أقوى | 2500–3000 mm/s | 16% | 50 kHz | من اختبار المسافة | 1 |

- إذا اتسعت الخطوط أو اسود الجلد: قلّل Power أو ارفع Speed، ثم أعد اختبار المسافة.
- إذا كانت الخطوط واضحة لكن خفيفة: ارفع Power تدريجيًا بخطوات صغيرة.
- إذا اختفت الخطوط الرفيعة: جرّب `Etched Crosshatch` أو ارفع قوة الخطوط درجة واحدة، لا تحوّل الصورة إلى Photo أسود.
- ثبّت الفوكس واستواء سطح المحفظة.
- لا تحفر جلدًا صناعيًا يحتوي PVC أو خامة مجهولة، واستخدم شفط أبخرة وحماية مناسبة.

## ما الذي أضافه البحث إلى المحرك؟

- `APDrawingGAN` وأبحاث Line Drawings للبورتريه: هوية الوجه تُحفظ بخطوط قليلة ومناطق ظل قليلة، لا بملء كل الظلال.
- `Informative Drawings`: استخراج خطوط تنقل هندسة الصورة ومعناها بدون الحاجة إلى أزواج صور/رسومات متطابقة؛ استخدمناه كمسار AI داخل المتصفح.
- `XDoG`: مرشح Difference-of-Gaussians الممتد قادر على إنتاج sketch وpencil shading وhatching وwoodcut؛ استخدمناه كأساس المسار المحلي.
- `Coherent Line Drawing / FDoG`: اتجاه البنية يساعد على ربط الخطوط وتقليل الضوضاء؛ لذلك يطبق المحرك ترشيح حواف رفيعة وتهشيرًا موجهًا بدل نويز عشوائي.
- `Combining Sketch and Tone`: فصل طبقة الخطوط عن طبقة التظليل يعطي تحكمًا أفضل؛ لذلك الخطوط والتهشير إعدادان مستقلان.
- أبحاث dot-overlap وDirect Binary Search: نموذج الجهاز وعرض النقطة أهم من شكل البكسل النظري؛ لذلك توجد معايرة وAnti-Charcoal بعد تركيب النتيجة النهائية.
- Blue Noise مناسب للنقط المنفردة المتجانسة، بينما Green Noise/clustered dots أثبت عندما لا تتحمل الخامة نقطة منفردة؛ لذلك ظل Ultra Photo يوفر Blue Noise وMicro Screen.

## المصادر الأساسية

- APDrawingGAN — CVPR 2019: https://openaccess.thecvf.com/content_CVPR_2019/papers/Yi_APDrawingGAN_Generating_Artistic_Portrait_Drawings_From_Face_Photos_With_Hierarchical_CVPR_2019_paper.pdf
- Line Drawings for Face Portraits: https://www.computer.org/csdl/journal/tp/2021/10/09069416/1j4FNWwfNtK
- Informative Drawings — المشروع والبحث: https://carolineec.github.io/informative_drawings/
- تطبيق JavaScript/ONNX المرجعي: https://github.com/josephrocca/image-to-line-art-js
- XDoG paper: https://www.cs.princeton.edu/courses/archive/spring19/cos426/papers/Winnemoeller12.pdf
- Coherent Line Drawing: https://cg.postech.ac.kr/papers/kang_npar07_hi.pdf
- Combining Sketch and Tone for Pencil Drawing: https://www.cse.cuhk.edu.hk/~leojia/projects/pencilsketch/pencil_drawing.htm
- Model-based halftoning with circular dot overlap: https://www.imaging.org/common/uploaded%20files/pdfs/Papers/1999/RP-0-93/1782.pdf
- Green Noise Digital Halftoning: https://www.eecis.udel.edu/~arce/files/Publications/5-GreenNoise.pdf
- Blue/Green Noise review: https://www.eecis.udel.edu/~arce/files/Publications/5-BlueGreen.pdf
- Ulichney Blue Noise: https://cv.ulichney.com/papers/2006-hexagonal-blue-noise.pdf
- LightBurn Image Mode وLine Interval: https://docs.lightburnsoftware.com/2.1/Reference/CutSettingsEditor/ImageMode/
- LightBurn Perfect Image Engraving: https://docs.lightburnsoftware.com/2.1/Guides/PerfectImageEngraving/
- Trotec photo engraving: https://www.troteclaser.com/en-us/helpcenter/software/jobcontrol/photo-laser-engraving
- ULS 1-Touch Laser Photo: https://ulsinc.com/support/1-touch-laser.html
- EZCAD3 Operator Manual: https://www.omglaser.com/wp-content/uploads/2021/07/EZCAD3-User-Manual.pdf

## الحد الواقعي للحل

V7 يعالج شكل الملف ويمنع تكوين الفحم رقميًا، لكنه لا يستطيع قياس كيمياء الجلد أو قطر العلامة من صورة الشاشة. النتيجة النهائية تعتمد على الجلد والطلاء والعدسة والفوكس ومصدر الليزر والطاقة والسرعة. اختبار المسافة وكارت الكثافة على قصاصة من نفس المنتج هما الجزء الأخير من الحل، وليس إعداد Power ثابتًا لكل المحافظ.
