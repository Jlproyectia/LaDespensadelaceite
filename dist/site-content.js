import {arrowIcon} from './icons.js';
export const language=document.documentElement.lang==='en'?'en':'es';
const choose=(es,en)=>language==='en'?en:es;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const money=value=>new Intl.NumberFormat(language==='en'?'en-GB':'es-ES',{style:'currency',currency:'EUR'}).format(value);
function image(img,src,alt){img.src=src;img.removeAttribute('srcset');if(alt)img.alt=alt;const button=img.closest('[data-photo]');if(button){button.dataset.photo=src;button.dataset.caption=img.alt;button.setAttribute('aria-label',choose('Ampliar: ','Enlarge: ')+img.alt);}}
function menu(site){
 for(const category of site.categories){
  const name=choose(category.es,category.en||category.es);
  document.querySelectorAll(`[data-category="${CSS.escape(category.id)}"]`).forEach(link=>{const number=link.querySelector('span')?.cloneNode(true);link.replaceChildren();if(number)link.append(number);link.append(document.createTextNode(name));});
  const section=document.querySelector(`[data-menu-category][id="${CSS.escape(category.id)}"]`);if(!section)continue;
  section.querySelector('h2').textContent=name;const list=section.querySelector('.menu-items');list.replaceChildren();
  for(const product of site.products.filter(p=>p.category===category.id).sort((a,b)=>a.order-b.order)){
   const name=choose(product.name,product.nameEn||product.name),description=choose(product.description,product.descriptionEn||product.description);
   const row=el('li',undefined,'menu-row'),copy=el('div');row.dataset.name=name+' '+description;copy.append(el('h3',name));if(description)copy.append(el('p',description));
   if(product.half!==null)copy.append(el('span',choose('Media ración · ','Half portion · ')+money(product.half),'half-price'));
   const price=el('span',product.price===null?choose('Consultar','Please ask'):money(product.price),'dish-price');if(product.unit!=='portion')price.append(el('small',product.unit==='each'?choose('/unidad','/each'):'/100 g'));
   row.append(copy,price);list.append(row);
  }
 }
 const cards=document.querySelector('.dish-cards');if(cards){cards.replaceChildren();for(const p of site.products.filter(p=>p.featured).sort((a,b)=>a.order-b.order)){
  const name=choose(p.name,p.nameEn||p.name),description=choose(p.description,p.descriptionEn||p.description),card=el('article',undefined,'dish-tile');card.dataset.dishCategory=p.category;card.dataset.name=name+' '+description;
  const button=el('button',undefined,'photo-frame dish-tile-image');button.dataset.photo=p.image;button.dataset.caption=name;button.setAttribute('aria-label',choose('Ampliar: ','Enlarge: ')+name);
  const img=el('img');img.src=p.image;img.alt=name;img.width=1536;img.height=1024;img.loading='lazy';const icon=el('span',undefined,'photo-plus');icon.innerHTML=arrowIcon('external');button.append(img,icon);
  const copy=el('div',undefined,'dish-tile-copy');copy.append(el('h2',name),el('span',p.price===null?choose('Consultar','Please ask'):money(p.price)+(p.unit==='each'?choose(' / unidad',' / each'):p.unit==='100g'?' / 100 g':'')));if(description)copy.append(el('p',description));card.append(button,copy);cards.append(card);
 }}
}
const dayNames={es:['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
export function todayStatus(schedule,date=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
 const dayKey=`${parts.year}-${parts.month}-${parts.day}`,day=new Date(dayKey+'T12:00:00Z').getUTCDay(),minute=+parts.hour*60+(+parts.minute),minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3));
 const previous=new Date(dayKey+'T12:00:00Z');previous.setUTCDate(previous.getUTCDate()-1);const previousKey=previous.toISOString().slice(0,10);
 const yesterday=schedule.days.find(d=>d.day===(day+6)%7);
 if(!yesterday.closed&&!schedule.closedDates.includes(previousKey))for(const slot of yesterday.slots){if(minutes(slot.end)<minutes(slot.start)&&minute<minutes(slot.end))return choose('Abierto · hasta las ','Open · until ')+slot.end;}
 const row=schedule.days.find(d=>d.day===day);if(row.closed||schedule.closedDates.includes(dayKey))return choose('Hoy cerrado','Closed today');
 for(const slot of row.slots){const start=minutes(slot.start),end=minutes(slot.end);if(minute>=start&&(end<=start||minute<end))return choose('Abierto · hasta las ','Open · until ')+slot.end;}
 const next=row.slots.filter(s=>minutes(s.start)>minute).sort((a,b)=>a.start.localeCompare(b.start))[0];return next?choose('Hoy abrimos a las ','Today we open at ')+next.start:choose('Hoy cerrado','Closed today');
}
function hours(schedule){
 for(const list of document.querySelectorAll('.opening-hours')){list.replaceChildren();for(const day of [1,2,3,4,5,6,0]){const row=schedule.days.find(d=>d.day===day),block=el('div'),term=el('dt',dayNames[language][day]),detail=el('dd');if(row.closed)detail.textContent=choose('Cerrado','Closed');else row.slots.forEach((slot,i)=>{if(i)detail.append(el('br'));detail.append(document.createTextNode(slot.start+'–'+slot.end));});block.append(term,detail);list.append(block);}}
 document.querySelectorAll('[data-hours-status]').forEach(n=>n.textContent=todayStatus(schedule));
 for(const script of document.querySelectorAll('script[type="application/ld+json"]'))try{const data=JSON.parse(script.textContent);data.openingHoursSpecification=schedule.days.filter(d=>!d.closed).flatMap(d=>d.slots.map(slot=>({'@type':'OpeningHoursSpecification',dayOfWeek:dayNames.en[d.day],opens:slot.start,closes:slot.end})));script.textContent=JSON.stringify(data);}catch{}
}
function apply(site){
 window.despensaSite=site;menu(site);hours(site.schedule);
 for(const [id,entry] of Object.entries(site.content||{})){if(entry.reset)continue;
  document.querySelectorAll(`[data-content-text="${CSS.escape(id)}"]`).forEach(n=>n.textContent=choose(entry.value,entry.en??entry.value));
  document.querySelectorAll(`[data-content-meta="${CSS.escape(id)}"]`).forEach(n=>{const value=choose(entry.value,entry.en??entry.value);if(n.tagName==='TITLE')n.textContent=value;else n.setAttribute('content',value);});
  document.querySelectorAll(`[data-content-image="${CSS.escape(id)}"]`).forEach(n=>image(n,entry.value,choose(entry.alt,entry.altEn||entry.alt)));
  document.querySelectorAll(`[data-content-link="${CSS.escape(id)}"]`).forEach(n=>{n.href=language==='en'?entry.value.replace(/^(index|carta|galeria|celebraciones|opiniones|informacion)\.html/,'$1.en.html'):entry.value;});
 }
}
export const siteReady=fetch('/api/app?action=site',{cache:'no-store',signal:AbortSignal.timeout(6000)}).then(r=>{if(!r.ok)throw Error('Content unavailable');return r.json();}).then(site=>{apply(site);return site;}).catch(()=>null);
await siteReady;
if(new URLSearchParams(location.search).get('editor')==='1'&&parent!==window){
 document.addEventListener('click',event=>{const node=event.target.closest('[data-content-image],[data-content-text],[data-content-link],[data-content-meta]');event.preventDefault();event.stopImmediatePropagation();if(node)parent.postMessage({type:'despensa-edit',id:node.dataset.contentImage||node.dataset.contentText||node.dataset.contentLink||node.dataset.contentMeta},location.origin);},true);
 const style=document.createElement('style');style.textContent='[data-content-text]:hover,[data-content-image]:hover{outline:2px solid #4c5c3b;outline-offset:3px;cursor:pointer}';document.head.append(style);
}
