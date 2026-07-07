const MP_VERSION = "0.10.35";
const MP_MODULE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs`;
const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const PERSON_MODEL = "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite";
const FACE_MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";
const HF_MODULE = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";
const MATTING_MODEL = "Xenova/modnet";
const UPSCALE_MODEL = "Xenova/swin2SR-classical-sr-x2-64";
const MAX_SIDE = 2400;

const PRESETS = {
  portrait: { dilate: 11, close: 4, contrast: 1.16, tone: .28, gb: 0, lb: 5, fgb: -7, flb: 9, edge: 50, noise: 9, holes: 16 },
  print: { dilate: 12, close: 4, contrast: 1.24, tone: .24, gb: 7, lb: 3, fgb: -4, flb: 8, edge: 47, noise: 12, holes: 24 },
  deep: { dilate: 14, close: 5, contrast: 1.30, tone: .20, gb: 18, lb: -1, fgb: 0, flb: 5, edge: 44, noise: 14, holes: 32 },
  soft: { dilate: 9, close: 3, contrast: 1.08, tone: .34, gb: -7, lb: 10, fgb: -10, flb: 12, edge: 35, noise: 4, holes: 8 }
};

const MATERIALS = {
  steel_photo: {
    title: "ستانلس / ميدالية — صورة ناعمة",
    power: "35–50%",
    speed: "800–1200 mm/s",
    frequency: "30–50 kHz",
    line: "0.04–0.05 mm",
    dpi: "500",
    loop: "1",
    note: "للصور الشخصية على الستانلس ابدأ بطاقة متوسطة وسرعة أعلى حتى لا تحرق تفاصيل الوجه. لو الصورة خفيفة قلّل السرعة تدريجيًا أو زوّد الطاقة 5%."
  },
  steel_dark: {
    title: "ستانلس — علامة غامقة أقوى",
    power: "45–60%",
    speed: "300–800 mm/s",
    frequency: "25–40 kHz",
    line: "0.03–0.05 mm",
    dpi: "500–600",
    loop: "1–2",
    note: "مناسب للكتابة واللوجو أو الصورة الغامقة. لا تبدأ به على وشوش الأطفال إلا بعد اختبار صغير لأنه ممكن يغمّق الملامح."
  },
  anodized: {
    title: "ألمنيوم أنودايز — علامة فاتحة",
    power: "60–100%",
    speed: "1500–3000 mm/s",
    frequency: "40–60 kHz",
    line: "0.03–0.05 mm",
    dpi: "500–600",
    loop: "1",
    note: "الألومنيوم الأنودايز عادة يستجيب بسرعة. لو العلامة باهتة قلّل السرعة بدل ما تزود الطاقة مباشرة."
  },
  brass_copper: {
    title: "نحاس / براس — اختبار آمن",
    power: "80–100%",
    speed: "150–400 mm/s",
    frequency: "35–50 kHz",
    line: "0.01–0.03 mm",
    dpi: "600–800",
    loop: "1–3",
    note: "النحاس والبراس عاكسين وصعبين. اعمل اختبار 20×20 mm أولًا، واشتغل بنظارة وحماية كاملة."
  },
  abs_plastic: {
    title: "ABS بلاستيك — طاقة منخفضة",
    power: "20–35%",
    speed: "400–800 mm/s",
    frequency: "30 kHz",
    line: "0.03–0.05 mm",
    dpi: "400–500",
    loop: "1",
    note: "البلاستيك يتحرق بسرعة. ابدأ بطاقة قليلة، واعمل تهوية جيدة لأن الأبخرة قد تكون ضارة."
  },
  test_grid: {
    title: "مصفوفة اختبار 6 خانات",
    power: "35 / 45 / 55%",
    speed: "700 / 1000 / 1200 mm/s",
    frequency: "40 kHz",
    line: "0.04–0.05 mm",
    dpi: "500",
    loop: "1",
    note: "اختبر جزء صغير من الوش 20×20 mm على 6 خانات، ثم ثبّت أفضل نتيجة كبريسيت داخل EZCAD."
  }
};
const DEFAULT_DPI = 500;
const DEFAULT_WIDTH_MM = 50;
const PX_LIMIT = 6200;
const $ = id => document.getElementById(id);
const ui = Object.fromEntries(["modeHome","photoWorkspace","eyeWorkspace","fileInput","dropZone","fileMeta","photoEnhanceBtn","prepareBtn","eyeBtn","eyeFileInput","eyeDropZone","eyeFileMeta","eyeEnhanceBtn","eyeDetailRange","eyeNoiseRange","cleanupRange","edgeSmoothRange","faceDetailRange","blackStrengthRange","eyeEmpty","eyePreview","eyeOriginalCanvas","modelBadge","progressWrap","progressBar","progressText","manualPanel","brushSize","resetMaskBtn","applyMaskBtn","emptyState","previewGrid","originalCanvas","maskCanvas","finalCanvas","eyeCanvas","eyeCard","maskCanvasWrap","resultStats","exportBar","invertBtn","cutoutBtn","pngBtn","bmpBtn","txtBtn","svgBtn","pdfBtn","eyePngBtn","eyeSvgBtn","sizeStat","faceStat","exportPxStat","toast","materialSelect","targetWidth","targetHeight","dpiSelect","lineSpacePreview","lockRatio","materialName","powerVal","speedVal","frequencyVal","lineSpaceVal","dpiVal","loopVal","settingsNote"].map(id => [id, $(id)]));
const state = { source:null, eyeSource:null, name:"portrait", eyeName:"eye", mask:null, alpha:null, cutout:null, finalMask:null, binary:null, eyeBinary:null, eyeWidth:0, eyeHeight:0, width:0, height:0, segmenter:null, faceLandmarker:null, mattingModel:null, upscaler:null, hfModule:null, hfPromise:null, mattingPromise:null, upscalePromise:null, vision:null, visionModule:null, modelPromise:null, facePromise:null, processing:false, inverted:false, manual:false, brushMode:"add", drawing:false, lastPoint:null, face:null, exportMeta:null, sourceProcessSize:null, toastTimer:0 };
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const tick = () => new Promise(r => requestAnimationFrame(() => setTimeout(r,0)));
const currentPreset = () => PRESETS[document.querySelector('input[name="preset"]:checked')?.value || "portrait"];
const qualitySettings = () => ({
  cleanup: clamp(parseInt(ui.cleanupRange?.value || 6,10) || 6,1,10),
  edgeSmooth: clamp(parseInt(ui.edgeSmoothRange?.value || 4,10) || 0,0,10),
  faceDetail: clamp(parseInt(ui.faceDetailRange?.value || 7,10) || 7,1,10),
  blackStrength: clamp(parseInt(ui.blackStrengthRange?.value || 5,10) || 5,1,10)
});

const currentMaterial = () => MATERIALS[ui.materialSelect?.value || "steel_photo"] || MATERIALS.steel_photo;
const getDpi = () => clamp(parseInt(ui.dpiSelect?.value || DEFAULT_DPI,10) || DEFAULT_DPI,300,800);
const mmToPx = (mm,dpi=getDpi()) => clamp(Math.round((Math.max(1,mm)/25.4)*dpi),32,PX_LIMIT);
const pxToMm = (px,dpi=getDpi()) => px/dpi*25.4;
const lineSpaceFromDpi = dpi => 25.4/dpi;
function readTargetSize(srcW=100,srcH=140){
  const dpi=getDpi(),ratio=srcH/srcW;
  let wmm=parseFloat(ui.targetWidth?.value)||DEFAULT_WIDTH_MM;
  let hmm=parseFloat(ui.targetHeight?.value)||wmm*ratio;
  if(ui.lockRatio?.checked){hmm=wmm*ratio;if(ui.targetHeight)ui.targetHeight.value=hmm.toFixed(1)}
  wmm=clamp(wmm,5,300);hmm=clamp(hmm,5,300);
  const w=mmToPx(wmm,dpi),h=mmToPx(hmm,dpi);
  return{w,h,wmm,hmm,dpi,lineSpace:lineSpaceFromDpi(dpi)};
}
function resizeBinaryNearest(binary,w,h,nw,nh){
  if(w===nw&&h===nh)return binary.slice();
  const out=new Uint8Array(nw*nh);
  for(let y=0;y<nh;y++){const sy=Math.min(h-1,Math.floor(y*h/nh));const row=sy*w;for(let x=0;x<nw;x++){out[y*nw+x]=binary[row+Math.min(w-1,Math.floor(x*w/nw))]}}
  return out;
}
function resizeMaskNearest(mask,w,h,nw,nh){
  if(w===nw&&h===nh)return mask.slice();
  const out=new Uint8Array(nw*nh);
  for(let y=0;y<nh;y++){const sy=Math.min(h-1,Math.floor(y*h/nh)),row=sy*w;for(let x=0;x<nw;x++)out[y*nw+x]=mask[row+Math.min(w-1,Math.floor(x*w/nw))]?1:0}
  return out;
}
function updateEzcadPanel(){
  const mat=currentMaterial(),dpi=getDpi(),ls=lineSpaceFromDpi(dpi);
  if(ui.materialName)ui.materialName.textContent=mat.title;
  if(ui.powerVal)ui.powerVal.textContent=mat.power;
  if(ui.speedVal)ui.speedVal.textContent=mat.speed;
  if(ui.frequencyVal)ui.frequencyVal.textContent=mat.frequency;
  if(ui.lineSpaceVal)ui.lineSpaceVal.textContent=mat.line;
  if(ui.dpiVal)ui.dpiVal.textContent=mat.dpi || String(dpi);
  if(ui.loopVal)ui.loopVal.textContent=mat.loop;
  if(ui.settingsNote)ui.settingsNote.textContent=mat.note;
  if(ui.lineSpacePreview)ui.lineSpacePreview.textContent=`${ls.toFixed(3)} mm`;
  if(ui.exportPxStat){
    ui.exportPxStat.textContent=state.exportMeta?`EZCAD ${state.exportMeta.wmm.toFixed(1)}×${state.exportMeta.hmm.toFixed(1)}mm · ${state.exportMeta.dpi}DPI · Line ${state.exportMeta.lineSpace.toFixed(3)}mm`:"مقاس EZCAD —";
  }
}
function buildSettingsText(){
  const mat=currentMaterial(),meta=state.exportMeta||readTargetSize(state.width||100,state.height||140);
  return [
    "Fiber Auto Max V4 — EZCAD 30W Settings",
    `File: ${state.name || "portrait"}`,
    `Material: ${mat.title}`,
    `Export size: ${state.width||meta.w} × ${state.height||meta.h} px`,
    `Physical size: ${meta.wmm.toFixed(1)} × ${meta.hmm.toFixed(1)} mm`,
    `DPI: ${meta.dpi}`,
    `EZCAD Line Space from DPI: ${meta.lineSpace.toFixed(3)} mm`,
    "",
    "Start EZCAD parameters:",
    `Power: ${mat.power}`,
    `Speed: ${mat.speed}`,
    `Frequency: ${mat.frequency}`,
    `Hatch / Line Space: ${mat.line}`,
    `Loop: ${mat.loop}`,
    "",
    "Workflow:",
    "1) Import the BMP or PNG into EZCAD.",
    "2) Set the object physical size exactly as listed above.",
    "3) Use Red Light Preview / Frame before Mark.",
    "4) Run a 20×20 mm test before full production.",
    "",
    `Note: ${mat.note}`
  ].join("\n");
}


function showToast(message,error=false){clearTimeout(state.toastTimer);ui.toast.textContent=message;ui.toast.className=`toast show${error?" error":""}`;state.toastTimer=setTimeout(()=>ui.toast.className="toast",3400)}
function modelStatus(s,t){ui.modelBadge.dataset.state=s;ui.modelBadge.querySelector("span").textContent=t}
function setProgress(n,t){ui.progressWrap.hidden=false;ui.progressBar.style.width=`${clamp(n,0,100)}%`;ui.progressText.textContent=t}
function endProgress(){setTimeout(()=>{if(!state.processing)ui.progressWrap.hidden=true},900)}
function makeCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c}
function fit(w,h,max=MAX_SIDE){const s=Math.min(1,max/Math.max(w,h));return{width:Math.max(1,Math.round(w*s)),height:Math.max(1,Math.round(h*s)),scale:s}}
async function ensureHF(){
  if(state.hfModule)return state.hfModule;if(state.hfPromise)return state.hfPromise;
  state.hfPromise=(async()=>{state.hfModule=await import(HF_MODULE);return state.hfModule})();return state.hfPromise;
}
async function ensureMatting(){
  if(state.mattingModel)return state.mattingModel;if(state.mattingPromise)return state.mattingPromise;
  state.mattingPromise=(async()=>{modelStatus("loading","تحميل AI العزل الاحترافي لأول مرة…");const {pipeline}=await ensureHF();state.mattingModel=await pipeline("background-removal",MATTING_MODEL,{dtype:"q8",device:"wasm"});modelStatus("ready","MODNet عزل احترافي جاهز");return state.mattingModel})().catch(e=>{state.mattingPromise=null;throw e});return state.mattingPromise;
}
async function ensureUpscaler(){
  if(state.upscaler)return state.upscaler;if(state.upscalePromise)return state.upscalePromise;
  state.upscalePromise=(async()=>{modelStatus("loading","تحميل AI توضيح الصورة لأول مرة…");const {pipeline}=await ensureHF();state.upscaler=await pipeline("image-to-image",UPSCALE_MODEL,{dtype:"q8",device:"wasm"});modelStatus("ready","AI العزل والتوضيح جاهز");return state.upscaler})().catch(e=>{state.upscalePromise=null;throw e});return state.upscalePromise;
}
async function rawToCanvas(raw){
  if(raw?.toCanvas)return await raw.toCanvas();if(!raw?.data||!raw.width||!raw.height)throw Error("Invalid AI image");
  const c=makeCanvas(raw.width,raw.height),ctx=c.getContext("2d"),im=new ImageData(raw.width,raw.height),d=im.data,src=raw.data,ch=raw.channels||Math.round(src.length/(raw.width*raw.height));
  for(let i=0,p=0;i<raw.width*raw.height;i++,p+=4){d[p]=src[i*ch]??0;d[p+1]=src[i*ch+Math.min(1,ch-1)]??d[p];d[p+2]=src[i*ch+Math.min(2,ch-1)]??d[p];d[p+3]=ch>3?(src[i*ch+3]??255):255}ctx.putImageData(im,0,0);return c;
}
function smartEnhanceCanvas(source){
  const c=makeCanvas(source.width,source.height),ctx=c.getContext("2d",{willReadFrequently:true}),blur=makeCanvas(source.width,source.height),bx=blur.getContext("2d",{willReadFrequently:true});ctx.drawImage(source,0,0);bx.filter="blur(1.15px)";bx.drawImage(source,0,0);const a=ctx.getImageData(0,0,c.width,c.height),b=bx.getImageData(0,0,c.width,c.height),d=a.data,bd=b.data;
  for(let p=0;p<d.length;p+=4)for(let k=0;k<3;k++){const sharp=d[p+k]+.72*(d[p+k]-bd[p+k]),contrast=(sharp-128)*1.08+128;d[p+k]=clamp(Math.round(contrast),0,255)}ctx.putImageData(a,0,0);return c;
}
async function aiEnhanceCanvas(source){
  const s=fit(source.width,source.height,900),input=makeCanvas(s.width,s.height),ix=input.getContext("2d");ix.imageSmoothingQuality="high";ix.drawImage(source,0,0,s.width,s.height);
  const upscaler=await ensureUpscaler(),raw=await upscaler(input.toDataURL("image/png")),ai=await rawToCanvas(raw),outSize=fit(ai.width,ai.height,MAX_SIDE),out=makeCanvas(outSize.width,outSize.height),ox=out.getContext("2d");ox.imageSmoothingQuality="high";ox.drawImage(ai,0,0,out.width,out.height);return smartEnhanceCanvas(out);
}
async function enhanceTarget(kind){
  const source=kind==="eye"?state.eyeSource:state.source,button=kind==="eye"?ui.eyeEnhanceBtn:ui.photoEnhanceBtn;if(!source||state.processing)return;state.processing=true;button.disabled=true;
  try{setProgress(15,"تحميل موديل Swin2SR المجاني…");let enhanced;try{enhanced=await aiEnhanceCanvas(source);showToast("تم توضيح الصورة بالـ AI وتكبير التفاصيل ×2.")}catch(e){console.warn(e);enhanced=smartEnhanceCanvas(source);modelStatus("ready","التحسين المحلي جاهز");showToast("تم تحسين الوضوح محليًا؛ موديل AI الكامل غير متاح على هذا الجهاز.",true)}if(kind==="eye"){state.eyeSource=enhanced;drawPreview(enhanced,ui.eyeOriginalCanvas);state.eyeBinary=null;ui.eyePngBtn.disabled=true;ui.eyeSvgBtn.disabled=true}else{state.source=enhanced;state.mask=state.alpha=state.cutout=state.binary=null;drawPreview(enhanced,ui.originalCanvas);placeholders();ui.resultStats.hidden=true;ui.exportBar.hidden=true}setProgress(100,"اكتمل تحسين الوضوح")}finally{state.processing=false;button.disabled=false;endProgress()}
}

async function ensureVisionResources(){
  if(!state.visionModule)state.visionModule=await import(MP_MODULE);
  if(!state.vision)state.vision=await state.visionModule.FilesetResolver.forVisionTasks(MP_WASM);
  return state;
}
async function ensureSegmenter(){
  if(state.segmenter)return state.segmenter;if(state.modelPromise)return state.modelPromise;
  modelStatus("loading","تحميل موديل عزل الشخص لأول مرة…");
  state.modelPromise=(async()=>{try{
    await ensureVisionResources();const {ImageSegmenter}=state.visionModule;
    state.segmenter=await ImageSegmenter.createFromOptions(state.vision,{baseOptions:{modelAssetPath:PERSON_MODEL,delegate:"CPU"},runningMode:"IMAGE",outputCategoryMask:true,outputConfidenceMasks:true});
    modelStatus("ready","Person Segmentation جاهز");return state.segmenter;
  }catch(e){console.error(e);state.modelPromise=null;modelStatus("error","تعذر الموديل — الفرشاة متاحة");throw e}})();return state.modelPromise;
}
async function ensureFaceLandmarker(){
  if(state.faceLandmarker)return state.faceLandmarker;if(state.facePromise)return state.facePromise;
  state.facePromise=(async()=>{try{modelStatus("loading","تحميل موديل تفاصيل العين…");await ensureVisionResources();const {FaceLandmarker}=state.visionModule;state.faceLandmarker=await FaceLandmarker.createFromOptions(state.vision,{baseOptions:{modelAssetPath:FACE_MODEL,delegate:"CPU"},runningMode:"IMAGE",numFaces:1,minFaceDetectionConfidence:.45,minFacePresenceConfidence:.45,minTrackingConfidence:.45});modelStatus("ready","عزل الشخص وتفاصيل العين جاهزان");return state.faceLandmarker}catch(e){state.facePromise=null;modelStatus("ready","عزل الشخص جاهز — تعذر موديل العين");throw e}})();return state.facePromise;
}

async function loadFile(file){
  if(!file?.type.startsWith("image/"))return showToast("اختر صورة PNG أو JPG أو WEBP.",true);
  try{const url=URL.createObjectURL(file),img=new Image();img.decoding="async";img.src=url;await img.decode();const natural=[img.naturalWidth,img.naturalHeight],size=fit(...natural),c=makeCanvas(size.width,size.height),ctx=c.getContext("2d",{alpha:false,willReadFrequently:true});
    ctx.fillStyle="white";ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingQuality="high";ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
    Object.assign(state,{source:c,name:(file.name.replace(/\.[^.]+$/,"")||"portrait").replace(/[^\w\u0600-\u06ff-]+/g,"-"),mask:null,alpha:null,cutout:null,finalMask:null,binary:null,inverted:false,manual:false,exportMeta:null,sourceProcessSize:null});
    ui.photoEnhanceBtn.disabled=false;
    ui.manualPanel.hidden=true;ui.maskCanvasWrap.classList.remove("editing");ui.prepareBtn.disabled=false;ui.invertBtn.disabled=true;ui.fileMeta.hidden=false;ui.fileMeta.textContent=`${file.name} · ${natural[0]}×${natural[1]}${size.scale<1?` · معالجة ${size.width}×${size.height}`:""}`;
    ui.emptyState.hidden=true;ui.previewGrid.hidden=false;ui.resultStats.hidden=true;ui.exportBar.hidden=true;drawPreview(c,ui.originalCanvas);placeholders();switchView("all");showToast("تم تحميل صورة الشخص. يمكنك توضيحها بالـ AI أو بدء العزل.");updateEzcadPanel();ensureMatting().catch(()=>ensureSegmenter().catch(()=>{}));
  }catch(e){console.error(e);showToast("تعذر فتح الصورة. جرّب ملفًا آخر.",true)}
}
function drawPreview(src,target){const s=fit(src.width,src.height,1100);target.width=s.width;target.height=s.height;const c=target.getContext("2d",{alpha:false});c.fillStyle="white";c.fillRect(0,0,target.width,target.height);c.imageSmoothingQuality="high";c.drawImage(src,0,0,target.width,target.height)}
function placeholders(){for(const c of[ui.maskCanvas,ui.finalCanvas]){c.width=c.height=700;const x=c.getContext("2d");x.fillStyle="white";x.fillRect(0,0,700,700);x.strokeStyle="#d8dcde";x.setLineDash([8,8]);x.strokeRect(95,95,510,510);x.setLineDash([]);x.fillStyle="#9da3a7";x.font="700 20px Segoe UI, Arial";x.textAlign="center";x.fillText("في انتظار المعالجة",350,360)}}

function bounds(mask,w,h){let x0=w,y0=h,x1=-1,y1=-1,area=0;for(let y=0;y<h;y++)for(let x=0,i=y*w;x<w;x++,i++)if(mask[i]){area++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}return area?{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,area}:null}
function primary(mask,w,h){
  const labels=new Int32Array(mask.length),q=new Int32Array(mask.length);let label=0,best=0,bestScore=-1;
  for(let seed=0;seed<mask.length;seed++){if(!mask[seed]||labels[seed])continue;label++;let head=0,tail=0,area=0,x0=w,y0=h,x1=0,y1=0;labels[seed]=label;q[tail++]=seed;
    while(head<tail){const i=q[head++],y=Math.floor(i/w),x=i-y*w;area++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);const add=n=>{if(mask[n]&&!labels[n]){labels[n]=label;q[tail++]=n}};if(x)add(i-1);if(x+1<w)add(i+1);if(y)add(i-w);if(y+1<h)add(i+w)}
    const dist=Math.hypot(((x0+x1)/2-w/2)/w,((y0+y1)/2-h/2)/h),score=area*(1.15-Math.min(.6,dist))*(1+(y1-y0+1)/h*.25);if(score>bestScore){bestScore=score;best=label}}
  const out=new Uint8Array(mask.length);for(let i=0;i<out.length;i++)out[i]=labels[i]===best?1:0;return out;
}
function dilate(mask,w,h,r){
  r=Math.max(1,Math.round(r));const a=new Uint8Array(mask.length),out=new Uint8Array(mask.length);
  for(let y=0;y<h;y++){const row=y*w;let n=0;for(let x=0;x<=Math.min(w-1,r);x++)n+=mask[row+x];for(let x=0;x<w;x++){a[row+x]=n>0;const add=x+r+1,sub=x-r;if(add<w)n+=mask[row+add];if(sub>=0)n-=mask[row+sub]}}
  for(let x=0;x<w;x++){let n=0;for(let y=0;y<=Math.min(h-1,r);y++)n+=a[y*w+x];for(let y=0;y<h;y++){out[y*w+x]=n>0;const add=y+r+1,sub=y-r;if(add<h)n+=a[add*w+x];if(sub>=0)n-=a[sub*w+x]}}return out;
}
function erode(mask,w,h,r){const inv=new Uint8Array(mask.length);for(let i=0;i<mask.length;i++)inv[i]=mask[i]?0:1;const d=dilate(inv,w,h,r);for(let i=0;i<d.length;i++)d[i]=d[i]?0:1;return d}
function fillHoles(mask,w,h,maxArea){
  const b=bounds(mask,w,h),seen=new Uint8Array(mask.length),q=new Int32Array(mask.length);if(!b)return mask;
  for(let sy=b.y;sy<b.y+b.h;sy++)for(let sx=b.x;sx<b.x+b.w;sx++){const seed=sy*w+sx;if(mask[seed]||seen[seed])continue;let head=0,tail=0,edge=false;seen[seed]=1;q[tail++]=seed;
    while(head<tail){const i=q[head++],y=Math.floor(i/w),x=i-y*w;if(x===b.x||x===b.x+b.w-1||y===b.y||y===b.y+b.h-1)edge=true;const add=n=>{if(!mask[n]&&!seen[n]){seen[n]=1;q[tail++]=n}};if(x>b.x)add(i-1);if(x<b.x+b.w-1)add(i+1);if(y>b.y)add(i-w);if(y<b.y+b.h-1)add(i+w)}if(!edge&&tail<=maxArea)for(let j=0;j<tail;j++)mask[q[j]]=1}
  return mask;
}
function reliable(b,w,h){if(!b)return false;const r=b.area/(w*h);return r>=.018&&r<=.88&&b.w/w>=.08&&b.h/h>=.18}
const smoothstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
function alphaFromMask(mask,w,h){
  const core=erode(mask,w,h,1),reach=dilate(mask,w,h,2),alpha=new Float32Array(mask.length);
  for(let i=0;i<alpha.length;i++)alpha[i]=core[i]?1:(reach[i]?0.72:0);
  return alpha;
}
function refinedAlpha(rawMask,prob,w,h){
  const core=erode(rawMask,w,h,1),reach=dilate(rawMask,w,h,2),alpha=new Float32Array(rawMask.length);
  for(let i=0;i<alpha.length;i++)alpha[i]=core[i]?1:(reach[i]?smoothstep(.10,.76,prob[i]):0);
  return alpha;
}
function alphaOtsu(alpha,mask){
  if(!alpha)return .12;const hist=new Uint32Array(256);let total=0,sum=0;
  for(let i=0;i<alpha.length;i++)if(mask[i]&&alpha[i]>.002){const v=clamp(Math.round(alpha[i]*255),0,255);hist[v]++;total++;sum+=v}
  if(total<64)return .12;let wb=0,sb=0,best=-1,t=34;
  for(let i=0;i<256;i++){wb+=hist[i];if(!wb)continue;const wf=total-wb;if(!wf)break;sb+=i*hist[i];const score=wb*wf*(sb/wb-(sum-sb)/wf)**2;if(score>best){best=score;t=i}}
  return clamp((t/255)*.72,.10,.28);
}
function cutoutMask(mask,alpha,w,h){
  if(!alpha)return mask;const base=bounds(mask,w,h),th=alphaOtsu(alpha,mask),seed=new Uint8Array(mask.length);
  for(let i=0;i<seed.length;i++)seed[i]=mask[i]&&alpha[i]>=th?1:0;
  let clean=primary(seed,w,h),b=bounds(clean,w,h);if(!base||!b||b.area<base.area*.35)return mask;
  const r=Math.max(1,Math.round(Math.max(w,h)/1800));clean=dilate(clean,w,h,r);clean=erode(dilate(clean,w,h,r),w,h,r);b=bounds(clean,w,h);if(!b||b.area<base.area*.35)return mask;
  clean=fillHoles(clean,w,h,Math.max(100,Math.round(b.area*.006)));return clean;
}
function buildWhiteCutout(mask,alpha){
  const w=state.source.width,h=state.source.height,cm=mask,b=bounds(cm,w,h);if(!b)return null;
  const q=qualitySettings(),edgeR=q.edgeSmooth?Math.max(1,Math.round(q.edgeSmooth*Math.max(w,h)/5200)):0,core=edgeR?erode(cm,w,h,edgeR):cm;
  const m=Math.max(1,Math.round(Math.max(b.w,b.h)*.012)),sx=Math.max(0,b.x-m),sy=Math.max(0,b.y-m),ex=Math.min(w,b.x+b.w+m),ey=Math.min(h,b.y+b.h+m),ow=ex-sx,oh=ey-sy,c=makeCanvas(ow,oh),ctx=c.getContext("2d",{alpha:false,willReadFrequently:true});
  ctx.fillStyle="white";ctx.fillRect(0,0,ow,oh);ctx.drawImage(state.source,sx,sy,ow,oh,0,0,ow,oh);const im=ctx.getImageData(0,0,ow,oh),d=im.data;
  for(let y=0;y<oh;y++)for(let x=0;x<ow;x++){const si=(y+sy)*w+x+sx,p=(y*ow+x)*4;if(!cm[si])d[p]=d[p+1]=d[p+2]=255;else if(edgeR&&!core[si]){const k=.06+q.edgeSmooth*.018;d[p]=clamp(Math.round(d[p]*(1-k)+255*k),0,255);d[p+1]=clamp(Math.round(d[p+1]*(1-k)+255*k),0,255);d[p+2]=clamp(Math.round(d[p+2]*(1-k)+255*k),0,255)}d[p+3]=255}
  ctx.putImageData(im,0,0);return c;
}
async function personMaskMediaPipe(){
  const seg=await ensureSegmenter(),result=seg.segment(state.source);if(!result?.categoryMask)throw Error("No mask");const w=state.source.width,h=state.source.height,cat=result.categoryMask,raw=cat.getAsUint8Array(),sw=cat.width,sh=cat.height,full=new Uint8Array(w*h),prob=new Float32Array(w*h),bg=result.confidenceMasks?.[0]?.getAsFloat32Array?.();
  for(let y=0;y<h;y++){const yy=Math.min(sh-1,Math.floor(y*sh/h)),src=yy*sw;for(let x=0;x<w;x++){const si=src+Math.min(sw-1,Math.floor(x*sw/w)),i=y*w+x,p=bg?1-bg[si]:(raw[si]>0?1:0);prob[i]=p;full[i]=(raw[si]>0||p>.24)?1:0}}cat.close?.();result.confidenceMasks?.forEach(m=>m.close?.());
  const rawPrimary=primary(full,w,h);let clean=rawPrimary.slice();if(!reliable(bounds(clean,w,h),w,h))throw Error("Weak mask");const p=currentPreset(),s=Math.max(w,h)/MAX_SIDE;clean=dilate(clean,w,h,Math.max(4,p.dilate*s));clean=erode(dilate(clean,w,h,Math.max(2,p.close*s)),w,h,Math.max(2,p.close*s));clean=fillHoles(clean,w,h,Math.max(80,Math.round(bounds(clean,w,h).area*.0025)));if(!reliable(bounds(clean,w,h),w,h))throw Error("Rejected mask");return{mask:clean,alpha:refinedAlpha(rawPrimary,prob,w,h)};
}
async function personMaskMODNet(){
  const model=await ensureMatting(),inputSize=fit(state.source.width,state.source.height,1400),input=makeCanvas(inputSize.width,inputSize.height),ix=input.getContext("2d");ix.imageSmoothingQuality="high";ix.drawImage(state.source,0,0,input.width,input.height);const output=await model(input.toDataURL("image/jpeg",.96)),raw=Array.isArray(output)?output[0]:output,maskCanvas=await rawToCanvas(raw),w=state.source.width,h=state.source.height,scaled=makeCanvas(w,h),sx=scaled.getContext("2d",{willReadFrequently:true});sx.imageSmoothingEnabled=true;sx.imageSmoothingQuality="high";sx.drawImage(maskCanvas,0,0,w,h);const md=sx.getImageData(0,0,w,h).data,prob=new Float32Array(w*h),seed=new Uint8Array(w*h);
  for(let i=0,p=0;i<prob.length;i++,p+=4){const v=Math.max(md[p],md[p+1],md[p+2])/255;prob[i]=v;seed[i]=v>.08?1:0}
  const rawPrimary=primary(seed,w,h),b=bounds(rawPrimary,w,h);if(!reliable(b,w,h))throw Error("MODNet weak matte");const r=Math.max(2,Math.round(Math.max(w,h)/1200)),closed=erode(dilate(rawPrimary,w,h,r),w,h,r);let clean=dilate(closed,w,h,r);clean=fillHoles(clean,w,h,Math.max(100,Math.round(b.area*.004)));const alpha=new Float32Array(prob.length),reach=dilate(rawPrimary,w,h,r*2);for(let i=0;i<alpha.length;i++)alpha[i]=reach[i]?smoothstep(.035,.94,prob[i]):0;return{mask:clean,alpha};
}
function fusePersonMasks(mod,mp,w,h){
  const mb=bounds(mod.mask,w,h),pb=bounds(mp.mask,w,h);if(!reliable(mb,w,h)||!reliable(pb,w,h))return mod;
  const q=qualitySettings(),long=Math.max(w,h),tight=Math.max(4,Math.round(long/(150+q.cleanup*14))),wide=Math.max(tight+3,Math.round(long/(88+q.cleanup*8))),modWide=Math.max(5,Math.round(long/145)),mpTight=dilate(mp.mask,w,h,tight),mpWide=dilate(mp.mask,w,h,wide),modGuard=dilate(mod.mask,w,h,modWide),out=new Uint8Array(w*h),alphaNeed=.88-q.cleanup*.018;
  for(let i=0;i<out.length;i++)out[i]=(mp.mask[i]&&modGuard[i])||(mod.mask[i]&&mpTight[i])||(mod.mask[i]&&(mod.alpha?.[i]||0)>alphaNeed&&mpWide[i])?1:0;
  let clean=primary(out,w,h),cb=bounds(clean,w,h);if(!cb||cb.area<Math.max(mb.area,pb.area)*.58)return mod;
  const closeR=Math.max(1,Math.round(long/1900)),openR=q.cleanup>=8?Math.max(1,Math.round(long/2400)):0;
  clean=dilate(clean,w,h,closeR);if(openR)clean=dilate(erode(clean,w,h,openR),w,h,openR);cb=bounds(clean,w,h);clean=fillHoles(clean,w,h,Math.max(120,Math.round((cb?.area||0)*.006)));
  const alpha=new Float32Array(w*h);for(let i=0;i<alpha.length;i++)alpha[i]=clean[i]?Math.max(mod.alpha?.[i]||0,mp.alpha?.[i]||0,.92):0;
  return{mask:clean,alpha};
}
async function personMask(){
  try{setProgress(15,"تشغيل MODNet لعزل الشعر والحواف الدقيقة…");const mod=await personMaskMODNet();try{setProgress(24,"مطابقة العزل مع MediaPipe لحماية الجسم وإزالة الخلفية…");const mp=await personMaskMediaPipe();modelStatus("ready","تم دمج MODNet + MediaPipe");return fusePersonMasks(mod,mp,state.source.width,state.source.height)}catch(e){console.warn("MediaPipe refine skipped",e);modelStatus("ready","MODNet عزل احترافي جاهز");return mod}}catch(e){console.warn("MODNet fallback",e);modelStatus("loading","تشغيل عزل MediaPipe الاحتياطي…");const result=await personMaskMediaPipe();modelStatus("ready","العزل الاحتياطي جاهز");return result}
}

function cropPerson(mask){
  const w=state.source.width,h=state.source.height,b=bounds(mask,w,h);if(!b)throw Error("Empty mask");const m=Math.max(2,Math.round(Math.max(b.w,b.h)*.025)),ow=b.w+2*m,oh=b.h+2*m,sx=b.x-m,sy=b.y-m,c=makeCanvas(ow,oh),ctx=c.getContext("2d",{alpha:false,willReadFrequently:true}),cm=new Uint8Array(ow*oh);
  ctx.fillStyle="white";ctx.fillRect(0,0,ow,oh);ctx.drawImage(state.source,-sx,-sy);for(let y=0;y<oh;y++){const yy=y+sy;if(yy<0||yy>=h)continue;for(let x=0;x<ow;x++){const xx=x+sx;if(xx>=0&&xx<w)cm[y*ow+x]=mask[yy*w+xx]}}
  return{source:c,mask:cm,w:ow,h:oh,subject:{x:m,y:m,w:b.w,h:b.h,area:b.area}};
}
async function faceRect(crop){
  if("FaceDetector" in window)try{const faces=await new FaceDetector({fastMode:false,maxDetectedFaces:3}).detect(crop.source);if(faces.length){faces.sort((a,b)=>b.boundingBox.width*b.boundingBox.height-a.boundingBox.width*a.boundingBox.height);const b=faces[0].boundingBox,px=b.width*.2,py=b.height*.2;return{x:clamp(Math.round(b.x-px),0,crop.w-1),y:clamp(Math.round(b.y-py),0,crop.h-1),w:clamp(Math.round(b.width+2*px),1,crop.w),h:clamp(Math.round(b.height+2*py),1,crop.h),detected:true}}}catch(e){console.warn(e)}
  const b=crop.subject,fw=Math.round(b.w*.58),fh=Math.round(clamp(b.h*.30,b.w*.28,b.h*.43));return{x:clamp(Math.round(b.x+(b.w-fw)/2),0,crop.w-1),y:b.y,w:clamp(fw,1,crop.w),h:clamp(fh,1,crop.h),detected:false};
}
function grayscale(data,mask){const out=new Uint8Array(mask.length),d=data.data;for(let i=0,p=0;i<mask.length;i++,p+=4)out[i]=mask[i]?Math.round(d[p]*.2126+d[p+1]*.7152+d[p+2]*.0722):255;return out}
function localMap(gray,mask,w,h,r,normalize,p){
  const n=gray.length,rs=new Float32Array(n),rc=new Uint16Array(n),out=new Uint8Array(n);
  for(let y=0;y<h;y++){const row=y*w;let sum=0,count=0;for(let x=0;x<=Math.min(w-1,r);x++)if(mask[row+x]){sum+=gray[row+x];count++}for(let x=0;x<w;x++){rs[row+x]=sum;rc[row+x]=count;const a=x+r+1,s=x-r;if(a<w&&mask[row+a]){sum+=gray[row+a];count++}if(s>=0&&mask[row+s]){sum-=gray[row+s];count--}}}
  for(let x=0;x<w;x++){let sum=0,count=0;for(let y=0;y<=Math.min(h-1,r);y++){sum+=rs[y*w+x];count+=rc[y*w+x]}for(let y=0;y<h;y++){const i=y*w+x,mean=count?sum/count:255;if(normalize&&mask[i]){const corrected=132+(gray[i]-mean)*p.contrast;out[i]=clamp(Math.round(corrected*(1-p.tone)+gray[i]*p.tone),0,255)}else out[i]=normalize?255:clamp(Math.round(mean),0,255);const a=y+r+1,s=y-r;if(a<h){sum+=rs[a*w+x];count+=rc[a*w+x]}if(s>=0){sum-=rs[s*w+x];count-=rc[s*w+x]}}}return out;
}
function otsu(gray,mask){const hist=new Uint32Array(256);let total=0,sum=0;for(let i=0;i<gray.length;i++)if(mask[i]){hist[gray[i]]++;total++;sum+=gray[i]}let wb=0,sb=0,best=-1,t0=128;for(let t=0;t<256;t++){wb+=hist[t];if(!wb)continue;const wf=total-wb;if(!wf)break;sb+=t*hist[t];const v=wb*wf*(sb/wb-(sum-sb)/wf)**2;if(v>best){best=v;t0=t}}return clamp(t0,72,190)}
const inFace=(x,y,f)=>f&&x>=f.x&&y>=f.y&&x<f.x+f.w&&y<f.y+f.h;
function binarize(gray,mask,w,h,face,p){
  const q=qualitySettings(),local=localMap(gray,mask,w,h,clamp(Math.round(Math.min(w,h)*.018),9,42),false,p),global=otsu(gray,mask),out=new Uint8Array(gray.length),blackBoost=(q.blackStrength-5)*4,faceDetail=(q.faceDetail-5)*2.6;out.fill(255);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(!mask[i])continue;const v=gray[i],f=inFace(x,y,face),th=(f ? 0.40 : 0.57)*(global+(f?p.fgb:p.gb))+(f ? 0.60 : 0.43)*(local[i]-(f?p.flb:p.lb))+blackBoost-(f?Math.max(0,faceDetail)*1.8:0);let black=v<th||v<global-(f?30:25)+blackBoost;const gx=-gray[i-w-1]-2*gray[i-1]-gray[i+w-1]+gray[i-w+1]+2*gray[i+1]+gray[i+w+1],gy=-gray[i-w-1]-2*gray[i-w]-gray[i-w+1]+gray[i+w-1]+2*gray[i+w]+gray[i+w+1],edge=(Math.abs(gx)+Math.abs(gy))/4,edgeLimit=Math.max(14,p.edge*(f ? 0.72 : 1)-(f?Math.max(0,faceDetail)*2.2:0));if(edge>edgeLimit&&v<(f?228:196)&&v<local[i]+(f?22:17))black=true;out[i]=black?0:255}return out;
}
function cleanComponents(binary,mask,w,h,face,minArea,maxHole){
  const filter=(target,limit,fill,protectFace,onlyInside)=>{const seen=new Uint8Array(binary.length),q=new Int32Array(binary.length);for(let seed=0;seed<binary.length;seed++){if(binary[seed]!==target||seen[seed]||(onlyInside&&!mask[seed]))continue;let head=0,tail=0,protectedPart=false,touchesOutside=false;seen[seed]=1;q[tail++]=seed;while(head<tail){const i=q[head++],y=Math.floor(i/w),x=i-y*w;if(protectFace&&inFace(x,y,face))protectedPart=true;for(const n of[x?i-1:-1,x+1<w?i+1:-1,y?i-w:-1,y+1<h?i+w:-1]){if(n<0){touchesOutside=true;continue}if(onlyInside&&!mask[n]){touchesOutside=true;continue}if(binary[n]===target&&!seen[n]){seen[n]=1;q[tail++]=n}}}if(!protectedPart&&!touchesOutside&&tail<=limit)for(let j=0;j<tail;j++)binary[q[j]]=fill}};
  filter(0,minArea-1,255,true,false);filter(255,maxHole,0,true,true);for(let i=0;i<binary.length;i++)if(!mask[i])binary[i]=255;return binary;
}
function toImageData(binary,w,h,invert=false,mask=null,transparent=false){const im=new ImageData(w,h),d=im.data;for(let i=0,p=0;i<binary.length;i++,p+=4){const outside=mask&&!mask[i],v=outside?255:(invert?255-binary[i]:binary[i]);d[p]=d[p+1]=d[p+2]=v;d[p+3]=transparent&&outside?0:255}return im}

function renderMask(){
  if(!state.source||!state.mask)return;const c=ui.maskCanvas;
  if(!state.manual&&state.cutout){const s=fit(state.cutout.width,state.cutout.height,1100);c.width=s.width;c.height=s.height;const ctx=c.getContext("2d",{alpha:false});ctx.fillStyle="white";ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingQuality="high";ctx.drawImage(state.cutout,0,0,c.width,c.height);return}
  const s=fit(state.source.width,state.source.height,1100);c.width=s.width;c.height=s.height;const ctx=c.getContext("2d",{alpha:false,willReadFrequently:true});ctx.fillStyle="white";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(state.source,0,0,c.width,c.height);const im=ctx.getImageData(0,0,c.width,c.height),d=im.data,sw=state.source.width,sh=state.source.height;
  for(let y=0;y<c.height;y++){const sy=Math.min(sh-1,Math.floor(y*sh/c.height));for(let x=0;x<c.width;x++){const sx=Math.min(sw-1,Math.floor(x*sw/c.width)),inside=state.mask[sy*sw+sx],i=(y*c.width+x)*4;if(!inside){d[i]=d[i+1]=d[i+2]=255;d[i+3]=255}else{d[i+3]=255;if(state.manual){d[i]=d[i]*.72+198*.28;d[i+1]=d[i+1]*.72+255*.28;d[i+2]=d[i+2]*.72+53*.28}}}}ctx.putImageData(im,0,0);
}
function renderFinal(){if(!state.binary)return;ui.finalCanvas.width=state.width;ui.finalCanvas.height=state.height;const ctx=ui.finalCanvas.getContext("2d",{alpha:false,willReadFrequently:true});ctx.fillStyle="white";ctx.fillRect(0,0,state.width,state.height);ctx.putImageData(toImageData(state.binary,state.width,state.height,state.inverted,state.finalMask,false),0,0);ui.invertBtn.classList.toggle("active",state.inverted)}
function pureBinary(){if(!state.binary)return false;const d=ui.finalCanvas.getContext("2d",{willReadFrequently:true}).getImageData(0,0,state.width,state.height).data;for(let i=0;i<d.length;i+=4)if(![0,255].includes(d[i])||d[i+1]!==d[i]||d[i+2]!==d[i]||![0,255].includes(d[i+3]))return false;return true}

async function processMask(mask){
  setProgress(48,"قص ذكي محكم حول الشخص بدون فريم أبيض زائد…");await tick();const crop=cropPerson(mask);setProgress(57,"تحديد الوجه وحماية الملامح…");await tick();const face=await faceRect(crop),data=crop.source.getContext("2d",{willReadFrequently:true}).getImageData(0,0,crop.w,crop.h),gray=grayscale(data,crop.mask),p=currentPreset();
  setProgress(66,"توحيد الإضاءة داخل الشخص فقط…");await tick();const balanced=localMap(gray,crop.mask,crop.w,crop.h,clamp(Math.round(Math.min(crop.w,crop.h)*.035),16,72),true,p);
  setProgress(77,"تحويل هجين مع تعزيز العين والفم والشعر…");await tick();let binary=binarize(balanced,crop.mask,crop.w,crop.h,face,p);setProgress(86,"تنظيف النويز والمكونات الصغيرة…");await tick();const q=qualitySettings(),f=Math.max(1,Math.round(crop.subject.area/900000)),noiseBoost=1+q.cleanup*.10+(10-q.faceDetail)*.035;binary=cleanComponents(binary,crop.mask,crop.w,crop.h,face,Math.round(p.noise*f*noiseBoost),Math.round(p.holes*f*(1+q.edgeSmooth*.04)));
  setProgress(92,"تحجيم الملف على مقاس EZCAD والـ DPI المختار…");await tick();const target=readTargetSize(crop.w,crop.h),sized=resizeBinaryNearest(binary,crop.w,crop.h,target.w,target.h),finalMask=resizeMaskNearest(crop.mask,crop.w,crop.h,target.w,target.h);Object.assign(state,{binary:sized,finalMask,width:target.w,height:target.h,face,inverted:false,sourceProcessSize:{w:crop.w,h:crop.h},exportMeta:{...target,material:ui.materialSelect?.value||"steel_photo"}});
  renderMask();renderFinal();if(!pureBinary())throw Error("Binary validation failed");setProgress(100,"جاهز لـ EZCAD — تم التحقق من اللونين والمقاس");ui.resultStats.hidden=false;ui.exportBar.hidden=false;ui.invertBtn.disabled=false;ui.sizeStat.textContent=`${target.w} × ${target.h} px`;ui.faceStat.textContent=face.detected?"تم اكتشاف الوجه وحماية ملامحه":"حماية الوجه التقديرية فعّالة";updateEzcadPanel();
}
async function autoPrepare(){
  if(!state.source||state.processing)return;state.processing=true;ui.prepareBtn.disabled=true;ui.resultStats.hidden=true;ui.exportBar.hidden=true;ui.invertBtn.disabled=true;
  try{setProgress(8,"تحميل محرك Person Segmentation…");await tick();setProgress(18,"عزل الشخص الأساسي من الخلفية…");const segmented=await personMask();state.mask=segmented.mask;state.alpha=segmented.alpha;state.cutout=buildWhiteCutout(state.mask,state.alpha);setProgress(38,"تنظيف الحواف وقص الصورة على خلفية بيضاء…");await tick();state.manual=false;ui.manualPanel.hidden=true;ui.maskCanvasWrap.classList.remove("editing");renderMask();await processMask(state.mask);showToast("تم عزل الشخص على خلفية بيضاء مقصوصة بدون فريم زائد.")}
  catch(e){console.error(e);manualMode();showToast("لم نعتمد ماسكًا ضعيفًا حتى لا يقطع الشخص. استخدم الفرشاة الآمنة.",true)}finally{state.processing=false;ui.prepareBtn.disabled=false;endProgress()}
}
function manualMode(){state.mask=new Uint8Array(state.source.width*state.source.height);state.mask.fill(1);state.alpha=null;state.cutout=null;state.manual=true;state.binary=null;ui.manualPanel.hidden=false;ui.maskCanvasWrap.classList.add("editing");ui.resultStats.hidden=true;ui.exportBar.hidden=true;ui.invertBtn.disabled=true;renderMask();switchView("mask")}
async function applyManual(){if(state.processing||!state.mask)return;const b=bounds(state.mask,state.source.width,state.source.height);if(!b||b.area<state.mask.length*.01)return showToast("الماسك صغير جدًا. لوّن الشخص كاملًا أولًا.",true);state.processing=true;ui.applyMaskBtn.disabled=true;ui.prepareBtn.disabled=true;try{setProgress(35,"اعتماد الماسك اليدوي وتنظيف حدوده…");await tick();state.alpha=alphaFromMask(state.mask,state.source.width,state.source.height);state.cutout=buildWhiteCutout(state.mask,state.alpha);state.manual=false;ui.maskCanvasWrap.classList.remove("editing");renderMask();await processMask(state.mask);showToast("تم تطبيق الماسك وإنشاء صورة الشخص على خلفية بيضاء مقصوصة.")}catch(e){console.error(e);showToast("تعذرت المعالجة. راجع الماسك وحاول مرة أخرى.",true)}finally{state.processing=false;ui.applyMaskBtn.disabled=false;ui.prepareBtn.disabled=false;endProgress()}}

function pointFromEvent(e){const r=ui.maskCanvas.getBoundingClientRect();return{x:clamp((e.clientX-r.left)/r.width*state.source.width,0,state.source.width-1),y:clamp((e.clientY-r.top)/r.height*state.source.height,0,state.source.height-1)}}
function paint(point){const w=state.source.width,h=state.source.height,r=+ui.brushSize.value*Math.max(w,h)/1200,from=state.lastPoint||point,dist=Math.hypot(point.x-from.x,point.y-from.y),steps=Math.max(1,Math.ceil(dist/Math.max(2,r*.35)));for(let s=0;s<=steps;s++){const t=s/steps,cx=from.x+(point.x-from.x)*t,cy=from.y+(point.y-from.y)*t,rr=r*r;for(let y=Math.max(0,Math.floor(cy-r));y<=Math.min(h-1,Math.ceil(cy+r));y++)for(let x=Math.max(0,Math.floor(cx-r));x<=Math.min(w-1,Math.ceil(cx+r));x++)if((x-cx)**2+(y-cy)**2<=rr)state.mask[y*w+x]=state.brushMode==="add"?1:0}state.lastPoint=point}
function switchView(view){ui.previewGrid.dataset.view=view;document.querySelectorAll(".view-tab").forEach(b=>b.classList.toggle("active",b.dataset.view===view))}
function download(blob,ext){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${state.name}-fiber-30w.${ext}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function exportCutoutPNG(){if(state.cutout)state.cutout.toBlob(b=>{if(b){const old=state.name;state.name=`${old}-white-cutout`;download(b,"png");state.name=old;showToast("تم تصدير الشخص فقط بخلفية بيضاء وبدون فريم زائد.")}},"image/png")}
function exportPNG(){if(state.binary)ui.finalCanvas.toBlob(b=>{if(b){download(b,"png");showToast("تم تصدير PNG للحفر بخلفية بيضاء ثابتة.")}},"image/png")}
function encodeBMP(canvas){
  const w=canvas.width,h=canvas.height,ctx=canvas.getContext("2d",{willReadFrequently:true}),data=ctx.getImageData(0,0,w,h).data,rowSize=Math.ceil((w*3)/4)*4,pixelSize=rowSize*h,fileSize=54+pixelSize,buf=new ArrayBuffer(fileSize),dv=new DataView(buf),bytes=new Uint8Array(buf);
  dv.setUint16(0,0x4D42,true);dv.setUint32(2,fileSize,true);dv.setUint32(10,54,true);dv.setUint32(14,40,true);dv.setInt32(18,w,true);dv.setInt32(22,h,true);dv.setUint16(26,1,true);dv.setUint16(28,24,true);dv.setUint32(34,pixelSize,true);dv.setInt32(38,2835,true);dv.setInt32(42,2835,true);
  let offset=54;for(let y=h-1;y>=0;y--){const row=y*w*4;for(let x=0;x<w;x++){const i=row+x*4;bytes[offset++]=data[i+2];bytes[offset++]=data[i+1];bytes[offset++]=data[i]}while((offset-54)%rowSize!==0)bytes[offset++]=0}
  return new Blob([buf],{type:"image/bmp"});
}
function exportBMP(){if(!state.binary)return;download(encodeBMP(ui.finalCanvas),"bmp");showToast("تم تصدير BMP مباشر للإدخال في EZCAD.")}
function exportSettingsTXT(){download(new Blob([buildSettingsText()],{type:"text/plain;charset=utf-8"}),"txt");showToast("تم تصدير ملف إعدادات EZCAD.")}
function svgPath(){const done=[];let active=new Map();for(let y=0;y<state.height;y++){const runs=[];let start=-1;for(let x=0;x<=state.width;x++){const i=y*state.width+x,black=x<state.width&&state.finalMask?.[i]&&(state.inverted?state.binary[i]===255:state.binary[i]===0);if(black&&start<0)start=x;if(!black&&start>=0){runs.push([start,x-start]);start=-1}}const next=new Map();for(const[x,w]of runs){const key=`${x}:${w}`,r=active.get(key)||{x,y,w,h:0};r.h++;next.set(key,r)}for(const[k,r]of active)if(!next.has(k))done.push(r);active=next}done.push(...active.values());return done.map(r=>`M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}Z`).join("")}
function exportSVG(){if(!state.binary)return;setProgress(30,"بناء مسارات SVG…");setTimeout(()=>{try{const svg=`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${state.width}" height="${state.height}" viewBox="0 0 ${state.width} ${state.height}"><rect width="100%" height="100%" fill="white"/><path d="${svgPath()}" fill="black"/></svg>`;download(new Blob([svg],{type:"image/svg+xml"}),"svg");setProgress(100,"تم إنشاء SVG vector-style");showToast("تم تصدير SVG بخلفية بيضاء ثابتة.")}catch(e){console.error(e);showToast("تعذر إنشاء SVG.",true)}endProgress()},30)}

const LEFT_EYE=[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246];
const RIGHT_EYE=[362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398];
const LEFT_BROW=[70,63,105,66,107,55,65,52,53,46];
const RIGHT_BROW=[300,293,334,296,336,285,295,282,283,276];
const LEFT_IRIS=[468,469,470,471,472],RIGHT_IRIS=[473,474,475,476,477];
function pointBounds(points,ids){const good=ids.map(i=>points[i]).filter(Boolean);if(!good.length)return null;const xs=good.map(p=>p.x),ys=good.map(p=>p.y);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}
function drawLandmarkLine(ctx,points,ids,sx,sy,closed=true){const good=ids.map(i=>points[i]).filter(Boolean);if(good.length<2)return;ctx.beginPath();ctx.moveTo(good[0].x-sx,good[0].y-sy);for(let i=1;i<good.length;i++)ctx.lineTo(good[i].x-sx,good[i].y-sy);if(closed)ctx.closePath();ctx.stroke()}
function renderEye(){if(!state.eyeBinary)return;const c=ui.eyeCanvas;c.width=state.eyeWidth;c.height=state.eyeHeight;const im=new ImageData(c.width,c.height),d=im.data;for(let i=0,p=0;i<state.eyeBinary.length;i++,p+=4){const v=state.eyeBinary[i]===0?0:255;d[p]=d[p+1]=d[p+2]=v;d[p+3]=255}const ctx=c.getContext("2d",{alpha:false});ctx.fillStyle="white";ctx.fillRect(0,0,c.width,c.height);ctx.putImageData(im,0,0)}
async function prepareEyesFromPortrait(){
  if(!state.source||state.processing)return;state.processing=true;ui.eyeBtn.disabled=true;
  try{setProgress(15,"تحديد الوجه ونقاط العين الحقيقية…");const detector=await ensureFaceLandmarker(),result=detector.detect(state.source),landmarks=result?.faceLandmarks?.[0];if(!landmarks?.length)throw Error("Face landmarks not found");const sw=state.source.width,sh=state.source.height,points=landmarks.map(p=>({x:p.x*sw,y:p.y*sh})),all=[...LEFT_EYE,...RIGHT_EYE,...LEFT_BROW,...RIGHT_BROW],b=pointBounds(points,all);if(!b)throw Error("Eye bounds not found");const mx=Math.max(8,b.w*.18),my=Math.max(8,b.h*.38),sx=clamp(Math.floor(b.x-mx),0,sw-1),sy=clamp(Math.floor(b.y-my),0,sh-1),ex=clamp(Math.ceil(b.x+b.w+mx),sx+1,sw),ey=clamp(Math.ceil(b.y+b.h+my),sy+1,sh),w=ex-sx,h=ey-sy,c=makeCanvas(w,h),ctx=c.getContext("2d",{willReadFrequently:true});ctx.drawImage(state.source,sx,sy,w,h,0,0,w,h);const data=ctx.getImageData(0,0,w,h),mask=new Uint8Array(w*h),regions=[[...LEFT_EYE,...LEFT_BROW],[...RIGHT_EYE,...RIGHT_BROW]].map(ids=>pointBounds(points,ids));for(let y=0;y<h;y++)for(let x=0;x<w;x++){const gx=x+sx,gy=y+sy;mask[y*w+x]=regions.some(r=>{const cx=r.x+r.w/2,cy=r.y+r.h/2,rx=Math.max(4,r.w*.72),ry=Math.max(4,r.h*.95);return((gx-cx)/rx)**2+((gy-cy)/ry)**2<=1})?1:0}
    setProgress(52,"استخراج الجفن والقزحية والحاجب من الصورة…");await tick();const gray=grayscale(data,mask),local=localMap(gray,mask,w,h,clamp(Math.round(Math.min(w,h)*.09),5,22),false,PRESETS.soft),binary=new Uint8Array(w*h);binary.fill(255);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(!mask[i])continue;const v=gray[i],gx=-gray[i-w-1]-2*gray[i-1]-gray[i+w-1]+gray[i-w+1]+2*gray[i+1]+gray[i+w+1],gy=-gray[i-w-1]-2*gray[i-w]-gray[i-w+1]+gray[i+w-1]+2*gray[i+w]+gray[i+w+1],edge=(Math.abs(gx)+Math.abs(gy))/4;if(v<local[i]-13||(edge>24&&v<local[i]+7&&v<222)||v<62)binary[i]=0}
    const lines=makeCanvas(w,h),lx=lines.getContext("2d",{alpha:true,willReadFrequently:true});lx.strokeStyle="#000";lx.lineWidth=clamp(Math.round(w/340),1,4);lx.lineCap="round";lx.lineJoin="round";drawLandmarkLine(lx,points,LEFT_EYE,sx,sy,true);drawLandmarkLine(lx,points,RIGHT_EYE,sx,sy,true);drawLandmarkLine(lx,points,LEFT_BROW,sx,sy,false);drawLandmarkLine(lx,points,RIGHT_BROW,sx,sy,false);drawLandmarkLine(lx,points,LEFT_IRIS,sx,sy,true);drawLandmarkLine(lx,points,RIGHT_IRIS,sx,sy,true);const ld=lx.getImageData(0,0,w,h).data;for(let i=0,p=3;i<binary.length;i++,p+=4)if(ld[p]>20)binary[i]=0;cleanComponents(binary,mask,w,h,null,2,0);Object.assign(state,{eyeBinary:binary,eyeWidth:w,eyeHeight:h});renderEye();ui.eyeCard.hidden=false;ui.eyePngBtn.hidden=false;ui.eyeSvgBtn.hidden=false;ui.exportBar.hidden=false;switchView("eye");setProgress(100,"رسمة العين جاهزة بخلفية بيضاء");showToast("تم استخراج العينين والحواجب والقزحية في ملف مستقل على أبيض.")
  }catch(e){console.error(e);showToast("لم أجد عينين واضحتين. استخدم صورة أمامية يظهر فيها الوجه كاملًا.",true)}finally{state.processing=false;ui.eyeBtn.disabled=false;endProgress()}
}
async function loadEyeFile(file){
  if(!file?.type.startsWith("image/"))return showToast("اختر صورة PNG أو JPG أو WEBP للعين.",true);
  try{const url=URL.createObjectURL(file),img=new Image();img.decoding="async";img.src=url;await img.decode();const natural=[img.naturalWidth,img.naturalHeight],size=fit(...natural),c=makeCanvas(size.width,size.height),ctx=c.getContext("2d",{alpha:false,willReadFrequently:true});ctx.fillStyle="white";ctx.fillRect(0,0,c.width,c.height);ctx.imageSmoothingQuality="high";ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);Object.assign(state,{eyeSource:c,eyeName:(file.name.replace(/\.[^.]+$/,"")||"eye").replace(/[^\w\u0600-\u06ff-]+/g,"-"),eyeBinary:null,eyeWidth:0,eyeHeight:0});ui.eyeFileMeta.hidden=false;ui.eyeFileMeta.textContent=file.name+" · "+natural[0]+"×"+natural[1];ui.eyeBtn.disabled=false;ui.eyeEnhanceBtn.disabled=false;ui.eyePngBtn.disabled=true;ui.eyeSvgBtn.disabled=true;ui.eyeEmpty.hidden=true;ui.eyePreview.hidden=false;drawPreview(c,ui.eyeOriginalCanvas);ui.eyeCanvas.width=ui.eyeCanvas.height=1;showToast("تم تحميل صورة العين فقط. اضغط تجهيز حفر العين.")}catch(e){console.error(e);showToast("تعذر فتح صورة العين.",true)}
}
function eyeCrop(binary,w,h){
  const ink=new Uint8Array(binary.length);for(let i=0;i<ink.length;i++)ink[i]=binary[i]===0?1:0;const b=bounds(ink,w,h);if(!b||b.area<w*h*.0008)throw Error("No eye detail");const m=Math.max(2,Math.round(Math.max(b.w,b.h)*.04)),sx=Math.max(0,b.x-m),sy=Math.max(0,b.y-m),ex=Math.min(w,b.x+b.w+m),ey=Math.min(h,b.y+b.h+m),ow=ex-sx,oh=ey-sy,out=new Uint8Array(ow*oh);out.fill(255);for(let y=0;y<oh;y++)for(let x=0;x<ow;x++)out[y*ow+x]=binary[(y+sy)*w+x+sx];return{binary:out,w:ow,h:oh};
}
async function prepareEyes(){
  if(!state.eyeSource||state.processing)return;state.processing=true;ui.eyeBtn.disabled=true;
  try{modelStatus("loading","تحليل تفاصيل العين…");const c=state.eyeSource,w=c.width,h=c.height,ctx=c.getContext("2d",{willReadFrequently:true}),data=ctx.getImageData(0,0,w,h),mask=new Uint8Array(w*h);mask.fill(1);const gray=grayscale(data,mask),detail=+ui.eyeDetailRange.value||6,noise=+ui.eyeNoiseRange.value||5,local=localMap(gray,mask,w,h,clamp(Math.round(Math.min(w,h)*.045),7,48),false,PRESETS.soft),global=otsu(gray,mask),binary=new Uint8Array(w*h);binary.fill(255);
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x,v=gray[i],gx=-gray[i-w-1]-2*gray[i-1]-gray[i+w-1]+gray[i-w+1]+2*gray[i+1]+gray[i+w+1],gy=-gray[i-w-1]-2*gray[i-w]-gray[i-w+1]+gray[i+w-1]+2*gray[i+w]+gray[i+w+1],edge=(Math.abs(gx)+Math.abs(gy))/4,edgeLimit=42-detail*2.5,localBias=18-detail*1.2;if(v<local[i]-localBias||(edge>edgeLimit&&v<local[i]+9&&v<228)||v<global-38)binary[i]=0}
    cleanComponents(binary,mask,w,h,null,Math.max(2,Math.round(noise*noise*w*h/2500000)),0);const cropped=eyeCrop(binary,w,h);Object.assign(state,{eyeBinary:cropped.binary,eyeWidth:cropped.w,eyeHeight:cropped.h});renderEye();ui.eyePngBtn.disabled=false;ui.eyeSvgBtn.disabled=false;modelStatus("ready","رسمة العين جاهزة");showToast("تم تجهيز العين وحدها وقص الفراغات لأقصى حد.")
  }catch(e){console.error(e);showToast("تفاصيل العين غير كافية. جرّب صورة أقرب أو استخدم AI توضيح أولًا.",true)}finally{state.processing=false;ui.eyeBtn.disabled=false}
}
function eyeSvgPath(){const done=[];let active=new Map(),w=state.eyeWidth,h=state.eyeHeight,b=state.eyeBinary;for(let y=0;y<h;y++){const runs=[];let start=-1;for(let x=0;x<=w;x++){const black=x<w&&b[y*w+x]===0;if(black&&start<0)start=x;if(!black&&start>=0){runs.push([start,x-start]);start=-1}}const next=new Map();for(const[x,rw]of runs){const key=`${x}:${rw}`,r=active.get(key)||{x,y,w:rw,h:0};r.h++;next.set(key,r)}for(const[k,r]of active)if(!next.has(k))done.push(r);active=next}done.push(...active.values());return done.map(r=>`M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}Z`).join("")}
function exportEyePNG(){if(state.eyeBinary)ui.eyeCanvas.toBlob(b=>{if(b){const old=state.name;state.name=state.eyeName+"-eye-detail";download(b,"png");state.name=old;showToast("تم تصدير رسمة العين PNG بخلفية بيضاء.")}},"image/png")}
function exportEyeSVG(){if(!state.eyeBinary)return;const svg=`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${state.eyeWidth}" height="${state.eyeHeight}" viewBox="0 0 ${state.eyeWidth} ${state.eyeHeight}"><rect width="100%" height="100%" fill="white"/><path d="${eyeSvgPath()}" fill="black"/></svg>`,old=state.name;state.name=state.eyeName+"-eye-detail";download(new Blob([svg],{type:"image/svg+xml"}),"svg");state.name=old;showToast("تم تصدير فيكتور العين بخلفية بيضاء.")}
function exportPDF(){if(!state.binary)return;const PDF=window.jspdf?.jsPDF;if(!PDF)return showToast("مكتبة PDF لم تُحمّل. استخدم PNG أو جرّب مع الإنترنت.",true);const land=state.width>state.height,page=land?[297,210]:[210,297],pdf=new PDF({orientation:land?"landscape":"portrait",unit:"mm",format:"a4",compress:true}),s=Math.min((page[0]-20)/state.width,(page[1]-20)/state.height),w=state.width*s,h=state.height*s;pdf.addImage(ui.finalCanvas.toDataURL("image/png"),"PNG",(page[0]-w)/2,(page[1]-h)/2,w,h,undefined,"FAST");pdf.save(`${state.name}-fiber-30w.pdf`);showToast("تم تصدير PDF للطباعة.")}

ui.fileInput.addEventListener("change",e=>loadFile(e.target.files[0]));ui.dropZone.addEventListener("dragover",e=>{e.preventDefault();ui.dropZone.classList.add("dragging")});ui.dropZone.addEventListener("dragleave",()=>ui.dropZone.classList.remove("dragging"));ui.dropZone.addEventListener("drop",e=>{e.preventDefault();ui.dropZone.classList.remove("dragging");loadFile(e.dataTransfer.files[0])});ui.prepareBtn.addEventListener("click",autoPrepare);ui.eyeBtn.addEventListener("click",prepareEyes);ui.applyMaskBtn.addEventListener("click",applyManual);ui.resetMaskBtn.addEventListener("click",()=>{if(state.mask){state.mask.fill(1);renderMask();showToast("تمت إعادة الماسك؛ امسح الخلفية بالفرشاة.")}});ui.invertBtn.addEventListener("click",()=>{if(state.binary){state.inverted=!state.inverted;renderFinal();showToast(state.inverted?"تم عكس الأبيض والأسود.":"تم إلغاء العكس.")}});ui.bmpBtn.addEventListener("click",exportBMP);ui.cutoutBtn.addEventListener("click",exportCutoutPNG);ui.pngBtn.addEventListener("click",exportPNG);ui.txtBtn.addEventListener("click",exportSettingsTXT);ui.svgBtn.addEventListener("click",exportSVG);ui.pdfBtn.addEventListener("click",exportPDF);ui.eyePngBtn.addEventListener("click",exportEyePNG);ui.eyeSvgBtn.addEventListener("click",exportEyeSVG);
function selectMode(mode){
  ui.modeHome.hidden=!!mode;ui.photoWorkspace.hidden=mode!=="photo";ui.eyeWorkspace.hidden=mode!=="eye";document.body.dataset.mode=mode||"home";window.scrollTo({top:0,behavior:"smooth"});if(mode==="photo"&&!state.source)setTimeout(()=>ui.fileInput.click(),120);if(mode==="eye"&&!state.eyeSource)setTimeout(()=>ui.eyeFileInput.click(),120);
}
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>selectMode(b.dataset.mode)));
document.querySelectorAll("[data-home]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();selectMode(null)}));
ui.eyeFileInput.addEventListener("change",e=>loadEyeFile(e.target.files[0]));ui.eyeDropZone.addEventListener("dragover",e=>{e.preventDefault();ui.eyeDropZone.classList.add("dragging")});ui.eyeDropZone.addEventListener("dragleave",()=>ui.eyeDropZone.classList.remove("dragging"));ui.eyeDropZone.addEventListener("drop",e=>{e.preventDefault();ui.eyeDropZone.classList.remove("dragging");loadEyeFile(e.dataTransfer.files[0])});
ui.photoEnhanceBtn.addEventListener("click",()=>enhanceTarget("photo"));ui.eyeEnhanceBtn.addEventListener("click",()=>enhanceTarget("eye"));
document.querySelectorAll('input[name="preset"]').forEach(input=>input.addEventListener("change",()=>{document.querySelectorAll(".preset").forEach(l=>l.classList.toggle("active",l.contains(input)&&input.checked));if(state.binary)showToast("تم تغيير البريسيت. اضغط التحضير لتطبيقه.")}));document.querySelectorAll(".view-tab").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));document.querySelectorAll(".tool-btn").forEach(b=>b.addEventListener("click",()=>{state.brushMode=b.dataset.brush;document.querySelectorAll(".tool-btn").forEach(x=>x.classList.toggle("active",x===b))}));
ui.maskCanvas.addEventListener("pointerdown",e=>{if(!state.manual)return;state.drawing=true;state.lastPoint=null;ui.maskCanvas.setPointerCapture(e.pointerId);paint(pointFromEvent(e))});ui.maskCanvas.addEventListener("pointermove",e=>{if(state.drawing&&state.manual)paint(pointFromEvent(e))});const finish=()=>{if(state.drawing){state.drawing=false;state.lastPoint=null;renderMask()}};ui.maskCanvas.addEventListener("pointerup",finish);ui.maskCanvas.addEventListener("pointercancel",finish);
for(const el of [ui.materialSelect,ui.dpiSelect,ui.targetWidth,ui.targetHeight,ui.lockRatio])el?.addEventListener("change",()=>{if(el===ui.materialSelect)showToast("تم تغيير خامة EZCAD. الإعدادات المعروضة قيم بداية للاختبار.");updateEzcadPanel()});
for(const el of [ui.targetWidth,ui.targetHeight])el?.addEventListener("input",()=>updateEzcadPanel());
updateEzcadPanel();
modelStatus("idle","AI يُحمّل مجانًا عند أول استخدام");
const initialMode=new URLSearchParams(location.search).get("mode");if(["photo","eye"].includes(initialMode))selectMode(initialMode);
window.__fiberAutoMax={get state(){return state},selectMode,verifyPureBinary:pureBinary,presets:Object.keys(PRESETS),materials:Object.keys(MATERIALS),version:"5.0.0-matbaagy"};
