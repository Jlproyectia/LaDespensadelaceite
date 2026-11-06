import fs from 'node:fs';
import {parse,serialize,parseFragment} from 'parse5';
import {createHash} from 'node:crypto';
const pages=['index','carta','galeria','celebraciones','opiniones','informacion'];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const set=(n,k,value)=>{const old=n.attrs?.find(a=>a.name===k);if(old)old.value=value;else(n.attrs??=[]).push({name:k,value});};
const plain=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(plain).join('');
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,20);
export function buildCMS(){
 const fields=new Map();
 for(const page of pages){
  const es=parse(fs.readFileSync(`dist/${page}.html`,'utf8')),en=parse(fs.readFileSync(`dist/${page}.en.html`,'utf8'));const counts={};
  function register(a,b,type,value,section,extra={}){
   const scope=['Cabecera','Pie de página','Reservas'].includes(section)?'global':`${page}.html`;
   const key=[scope,section,type,value].join('|');const index=counts[key]=(counts[key]||0)+1;
   const id=hash(key+'|'+index);fields.set(id,fields.get(id)||{id,page:scope,section,type,value,...extra});
   set(a,'data-content-'+type,id);set(b,'data-content-'+type,id);
  }
  function walk(a,b,section='General'){
   if(!b||['script','style','svg','noscript'].includes(a.tagName))return;
   const cls=attr(a,'class')||'';
   if(/\b(dish-cards|menu-items|category-nav|category-heading|opening-hours|language-switch|calendar-days|calendar-week)\b/.test(cls))return;
   if(a.tagName==='header')section='Cabecera';if(a.tagName==='footer')section='Pie de página';if(cls.includes('booking-dialog'))section='Reservas';
   if(a.tagName==='section'){
    const heading=(function find(n){if(['h1','h2'].includes(n.tagName))return plain(n);for(const child of n.childNodes||[]){const found=find(child);if(found)return found;}})(a);
    section=heading?.trim()||attr(a,'id')||section;
   }
   if(a.tagName==='head'){
    for(let i=0;i<a.childNodes.length;i++){const x=a.childNodes[i],y=b.childNodes[i];
     if(x.tagName==='title')register(x,y,'meta',plain(x),'Buscadores',{en:plain(y),label:'Título de la página',attribute:'text'});
     if(x.tagName==='meta'&&['description','og:description','og:title'].includes(attr(x,'name')||attr(x,'property')))register(x,y,'meta',attr(x,'content'),'Buscadores',{en:attr(y,'content'),label:attr(x,'name')||attr(x,'property'),attribute:'content'});
    }return;
   }
   if(a.tagName==='img'&&attr(a,'src'))register(a,b,'image',attr(a,'src'),section,{alt:attr(a,'alt')||'',altEn:attr(b,'alt')||''});
   if(a.tagName==='a'&&attr(a,'href')&&!attr(a,'href').includes('admin.html'))register(a,b,'link',attr(a,'href'),section,{label:plain(a).trim(),en:attr(b,'href')});
   if(['input','select','textarea'].includes(a.tagName))return;
   const children=[...(a.childNodes||[])];
   for(let i=0;i<children.length;i++){
    const x=children[i],y=b.childNodes?.[i];if(!y)throw Error(`Bilingual structure mismatch: ${page}`);
    if(x.nodeName==='#text'&&/[\p{L}\p{N}]/u.test(x.value)&&x.value.trim()){
     const span=parseFragment('<span class="cms-inline"></span>').childNodes[0],other=parseFragment('<span class="cms-inline"></span>').childNodes[0];
     span.childNodes=[x];x.parentNode=span;span.parentNode=a;a.childNodes[i]=span;
     other.childNodes=[y];y.parentNode=other;other.parentNode=b;b.childNodes[i]=other;
     register(span,other,'text',x.value.trim(),section,{en:y.value.trim()});
    }else if(x.tagName)walk(x,y,section);
   }
  }
  walk(es,en);
  fs.writeFileSync(`dist/${page}.html`,serialize(es));fs.writeFileSync(`dist/${page}.en.html`,serialize(en));
 }
 fs.writeFileSync('server/site-manifest.json',JSON.stringify([...fields.values()],null,2));
 for(const file of ['admin.html','admin.js','admin.css','admin-site.js'])fs.copyFileSync('admin/'+file,'dist/'+file);
 fs.copyFileSync('src/site-content.js','dist/site-content.js');
 console.log(`CMS: ${fields.size} editable fields, six bilingual pages.`);
}
