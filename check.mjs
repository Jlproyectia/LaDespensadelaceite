import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const dir=path.resolve('dist');const pages=fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&f!=='admin.html');let links=0,images=0;
assert.equal(pages.length,12,'Six pages in each language');
const spanishReviews=fs.readFileSync('data/reviews-es.txt','utf8').trim().split(/\r?\n/);
const englishReviews=fs.readFileSync('data/google-five-star.tsv','utf8').trim().split(/\r?\n/).map(line=>line.split('\t')[1]);
const htmlEscape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const page of ['index','opiniones']){
  for(const [suffix,language,reviews] of [['','es',spanishReviews],['.en','en',englishReviews]]){
    const html=fs.readFileSync(path.join(dir,`${page}${suffix}.html`),'utf8');
    const rendered=[...html.matchAll(new RegExp(`<blockquote lang="${language}">(.*?)</blockquote>`,'g'))].map(m=>m[1].replace(/<[^>]+>/g,'').slice(1,-1).replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
    assert.equal(rendered.length,143,'Every review is available in each language');
    assert.deepEqual(rendered,reviews,'Review translations retain their original order');
  }
}
for(const file of pages){
  const html=fs.readFileSync(path.join(dir,file),'utf8');
  const base=file.replace('.en.html','.html');
  assert.match(html,/>ES<\/a>/,'Language selector uses ES');
  assert.doesNotMatch(html,/>SN<\/a>/);
  assert.doesNotMatch(html,/<p class="source-note">(?:Extractos traducidos|Valoración global:|Selección de reseñas de cinco estrellas consultadas)/);
  const visibleText=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,'');
  assert.doesNotMatch(visibleText,/[↗←→↓↑]/,'Arrows render as SVG icons');
  assert.ok(html.includes(`href="${base}" lang="es" hreflang="es"`),'Spanish switch keeps the current page');
  assert.ok(html.includes(`href="${base.replace('.html','.en.html')}" lang="en" hreflang="en"`),'English switch keeps the current page');
  if(file.endsWith('.en.html')){
    const withoutSwitch=html.replace(/<div class="language-switch".*?<\/div>/s,'');
    assert.doesNotMatch(withoutSwitch,/href="(?:index|carta|galeria|celebraciones|opiniones|informacion)\.html/,'English navigation stays in English');
  }
}
for(const file of pages){const html=fs.readFileSync(path.join(dir,file),'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one h1`);assert.ok(html.includes(`<html lang="${file.endsWith(".en.html") ? "en" : "es"}"`), `${file}: correct language`);for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const ref=m[1];if(/^(https?:|tel:|data:)/.test(ref))continue;const [part,hash]=ref.split('#');const target=path.resolve(dir,part.split('?')[0]||file);assert.ok(target.startsWith(dir+path.sep),`outside dist ${ref}`);assert.ok(fs.existsSync(target),`${file}: missing ${ref}`);if(hash){const text=fs.readFileSync(target,'utf8');assert.ok(text.includes(`id="${hash}"`),`${file}: missing anchor ${ref}`)}links++}for(const m of html.matchAll(/<img\b[^>]*>/g)){assert.match(m[0],/alt="[^"]+"/);assert.match(m[0],/width="\d+"/);assert.match(m[0],/height="\d+"/);images++}assert.ok(!/href="#"|lorem ipsum/i.test(html),`${file}: placeholder`);const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);JSON.parse(json[1]);}
const carta=fs.readFileSync(path.join(dir,'carta.html'),'utf8');assert.equal((carta.match(/class="menu-row"/g)||[]).length,63);assert.match(carta,/id="dish-search"/);assert.match(carta,/El precio del combinado ibérico requiere confirmación/);
const home=fs.readFileSync(path.join(dir,'index.html'),'utf8');assert.equal((home.match(/class="review-card card"/g)||[]).length,143);assert.match(home,/1.540 reseñas/);assert.match(fs.readFileSync(path.join(dir,'site.css'),'utf8'),/prefers-reduced-motion/);
console.log(`PASS: ${pages.length} pages, ${links} local links/assets, ${images} images, 63 menu rows, review links, structured data and reduced-motion support.`);
assert.equal((carta.match(/class="dish-tile"/g)||[]).length,32,'32 individual illustrated dishes');
assert.equal((home.match(/class="moment-card"/g)||[]).length,20,'20 gallery moments');
assert.equal((home.match(/aria-label="5 de 5 estrellas"/g)||[]).length,143,'All displayed reviews are five stars');
assert.match(carta,/<form[^>]+method="dialog"/,'Reservation preview never performs a native network submission');
assert.doesNotMatch(fs.readFileSync(path.join(dir,'experience.js'),'utf8'),/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/,'Demo does not send or persist customer details');



assert.equal((carta.match(/class="category-photo"/g)||[]).length,11,'Every menu category has its own image');
const categoryFiles=[...carta.matchAll(/class="category-photo"><img[^>]+src="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(categoryFiles).size,11,'Category photos are unique');
const allHtml=pages.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('');const uniqueImages=new Set([...allHtml.matchAll(/<img[^>]+src="images\/([^"]+)"/g)].map(m=>m[1]));assert.ok(uniqueImages.size>=36,'At least 36 unique photos across the website');console.log('PASS: '+uniqueImages.size+' unique photos, 11 distinct category images.');


