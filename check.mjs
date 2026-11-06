import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const dir=path.resolve('dist');const pages=fs.readdirSync(dir).filter(f=>f.endsWith('.html'));let links=0,images=0;
for(const file of pages){const html=fs.readFileSync(path.join(dir,file),'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1,`${file}: one h1`);assert.match(html,/<html lang="es"/);for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const ref=m[1];if(/^(https?:|tel:|data:)/.test(ref))continue;const [part,hash]=ref.split('#');const target=path.resolve(dir,part.split('?')[0]||file);assert.ok(target.startsWith(dir+path.sep),`outside dist ${ref}`);assert.ok(fs.existsSync(target),`${file}: missing ${ref}`);if(hash){const text=fs.readFileSync(target,'utf8');assert.ok(text.includes(`id="${hash}"`),`${file}: missing anchor ${ref}`)}links++}for(const m of html.matchAll(/<img\b[^>]*>/g)){assert.match(m[0],/alt="[^"]+"/);assert.match(m[0],/width="\d+"/);assert.match(m[0],/height="\d+"/);images++}assert.ok(!/href="#"|lorem ipsum/i.test(html),`${file}: placeholder`);const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);JSON.parse(json[1]);}
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


