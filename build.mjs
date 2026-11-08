import fs from 'node:fs';
const out='dist';
const menu=JSON.parse(fs.readFileSync('data/menu.json','utf8').replace(/^\uFEFF/,''));
const maps='https://www.google.com/maps?cid=9481275020294651586';
const reviews='https://www.google.com/maps/place/La+Despensa+del+Aceite/@36.5392733,-4.6248619,17z/data=!4m8!3m7!1s0xd72e2152ee978a9:0x83944165a2727ec2!8m2!3d36.5392733!4d-4.6248619!9m1!1b1!16s%2Fg%2F11c52rzcf6';
const origin='https://la-despensa-del-aceite-fuengirola.leviturjeman.chatgpt.site';
const arrow='<svg class="m-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const ext='target="_blank" rel="noopener noreferrer"';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const money=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
const ids=['ibericos','ensaladas','delicatessen','pescados','cerdo-iberico','ternera','brochetones','alpargatas','infantil','postres'];
const proof=[{name:'Beatriz Hoz',initials:'BH',quote:'Una cena de diez! Todo muy rico, personal amable...volveremos seguro!',source:'https://restaurantguru.com/La-Despensa-del-Aceite-Fuengirola'},{name:'Jaime Gallego',initials:'JG',quote:'Un buen lugar para comer',source:'https://www.sluurpy.es/fuengirola/restaurant/1844649/la-despensa-del-aceite-fuengirola'},{name:'Rocio Martin Vecino',initials:'RM',quote:'te hace sentir como en casa',source:'https://www.sluurpy.es/fuengirola/restaurant/1844649/la-despensa-del-aceite-fuengirola'}];
function head(title,description,file){return `<!doctype html><html lang="es" data-type="place" data-radius="soft" data-buttons="solid" data-motion><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${title}</title><meta name="description" content="${description}"><meta name="theme-color" content="#455038"><meta name="page-type" content="place"><meta name="page-kind" content="place"><meta name="site-kind" content="other"><link rel="canonical" href="${origin}/${file==='index.html'?'':file}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:image" content="${origin}/images/fachada.webp"><meta property="og:type" content="website"><meta property="og:locale" content="es_ES"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500&family=Figtree:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/system.css"><link rel="stylesheet" href="assets/ui/cards.css"><link rel="stylesheet" href="assets/motion/motion.css"><link rel="stylesheet" href="assets/layout/layout.css"><link rel="stylesheet" href="site.css?v=10"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Restaurant',name:'La Despensa del Aceite',telephone:'+34951438845',url:origin,address:{'@type':'PostalAddress',streetAddress:'Calle San Antonio, 17',addressLocality:'Fuengirola',addressRegion:'Málaga',addressCountry:'ES'},servesCuisine:['Española','Mediterránea'],hasMenu:origin+'/carta.html',hasMap:maps,image:origin+'/images/fachada.webp',openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Wednesday','Thursday','Friday','Saturday'],opens:'13:00',closes:'16:30'},{'@type':'OpeningHoursSpecification',dayOfWeek:['Wednesday','Thursday','Friday','Saturday'],opens:'20:00',closes:'00:00'},{'@type':'OpeningHoursSpecification',dayOfWeek:['Sunday'],opens:'13:30',closes:'16:30'}]})}</script></head>`;}
import {redesign} from './redesign.mjs';
fs.mkdirSync(out,{recursive:true});
redesign({menu,maps,reviews,origin,proof,head,esc,money,ids,arrow,ext});
fs.writeFileSync(`${out}/favicon.svg`,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#455038"/><text x="32" y="45" text-anchor="middle" fill="#f7f3ec" font-family="Georgia,serif" font-size="40">D</text></svg>');
fs.writeFileSync(`${out}/robots.txt`,`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(`${out}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','carta.html','galeria.html','celebraciones.html','opiniones.html','informacion.html'].map(p=>`<url><loc>${origin}/${p}</loc></url>`).join('')}</urlset>`);

const {buildLanguages}=await import('./build-languages.mjs');
buildLanguages();
const {buildCMS}=await import('./scripts/cms-build.mjs');
buildCMS();
console.log('Built six pages in Spanish and English with 11 illustrated menu categories.');

