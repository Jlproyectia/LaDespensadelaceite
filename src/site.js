const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=false;try{paused=localStorage.getItem('despensa-motion')==='off'}catch{}
const animations=new Set();
function motion(){document.documentElement.toggleAttribute('data-motion-off',paused||preference.matches);document.querySelectorAll('.motion-control').forEach(b=>{b.textContent=paused?'Activar animaciones':'Pausar animaciones';b.setAttribute('aria-pressed',String(paused))});if(paused||preference.matches)animations.forEach(a=>a.finish())}
motion();preference.addEventListener('change',motion);
document.querySelectorAll('.motion-control').forEach(b=>b.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('despensa-motion',paused?'off':'on')}catch{}motion()}));
// Finite, staggered entrances. Content remains visible if JavaScript is unavailable.
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(({target},i)=>{if(!paused&&!preference.matches){const a=target.animate([{opacity:.2,transform:'translateY(32px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,delay:Math.min(i*85,255),easing:'cubic-bezier(.22,1,.36,1)'});animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>{})}observer.unobserve(target)})},{threshold:.1});document.querySelectorAll('[data-reveal],.review-card').forEach(el=>observer.observe(el))}
const header=document.querySelector('.site-header');let scheduled=false;
function headerState(){header?.classList.toggle('is-scrolled',scrollY>40);scheduled=false}headerState();addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(headerState)}},{passive:true});
const toggle=document.querySelector('.nav-toggle'),nav=document.querySelector('#main-nav');
function closeNav(focus=false){nav.classList.remove('is-open');document.body.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');if(focus)toggle.focus()}
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('is-open',open);document.body.classList.toggle('nav-open',open);if(open)nav.querySelector('a').focus()});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeNav()));
addEventListener('keydown',e=>{if(toggle?.getAttribute('aria-expanded')!=='true')return;if(e.key==='Escape'){closeNav(true)}if(e.key==='Tab'){const items=[...header.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)closeNav()});
const dialog=document.querySelector('.photo-dialog');let photoTrigger;
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{photoTrigger=b;const im=dialog.querySelector('img');im.src=b.dataset.photo;im.alt=b.dataset.caption;dialog.querySelector('p').textContent=b.dataset.caption;dialog.showModal()}));
dialog?.querySelector('.photo-close').addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog?.addEventListener('close',()=>photoTrigger?.focus());
const search=document.querySelector('#dish-search'),clear=document.querySelector('.clear-search');
if(search){
let selected='all';
const clean=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const filter=()=>{const value=clean(search.value.trim());let count=0;document.querySelectorAll('[data-menu-category]').forEach(section=>{let visible=0;section.querySelectorAll('.menu-row').forEach(row=>{row.hidden=!clean(row.dataset.name).includes(value);if(!row.hidden)visible++});section.hidden=visible===0||(selected!=='all'&&section.id!==selected);section.classList.toggle('is-selected',selected===section.id);if(!section.hidden)count+=visible});document.querySelector('.search-status').textContent=value||selected!=='all'?(count?count+' platos disponibles':'No encontramos ese plato. Prueba otro nombre o categoría.'):'';clear.hidden=!value;document.querySelectorAll('[data-dish-category]').forEach(card=>{card.hidden=(selected!=='all'&&card.dataset.dishCategory!==selected)||!clean(card.dataset.name).includes(value)});document.querySelector('.full-menu-heading').hidden=selected!=='all'||!!value;document.querySelector('.visual-menu').classList.toggle('has-selection',selected!=='all');document.querySelectorAll('[data-category]').forEach(b=>{const active=b.dataset.category===selected;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))})};
search.addEventListener('input',filter);clear.addEventListener('click',()=>{search.value='';filter();search.focus()});
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();selected=b.dataset.category;filter();if(b.classList.contains('category-card'))document.querySelector('.menu-toolbar').scrollIntoView({behavior:paused||preference.matches?'instant':'smooth',block:'start'})}));
if(location.hash&&document.getElementById(location.hash.slice(1))?.matches('[data-menu-category]')){selected=location.hash.slice(1);filter()}
const beforePrint=()=>{selected='all';search.value='';filter()};document.querySelector('.print-menu')?.addEventListener('click',()=>{beforePrint();print()});addEventListener('beforeprint',beforePrint);
}
import './kitchen-scroll.js';
const output=document.querySelector('[data-hours-status]');if(output){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(p=>[p.type,p.value]));const minute=Number(parts.hour)*60+Number(parts.minute),day=parts.weekday;let text='Hoy cerrado';if(['Wed','Thu','Fri','Sat'].includes(day))text=minute>=780&&minute<990?'Abierto · hasta las 16:30':minute>=1200?'Abierto · hasta las 00:00':minute<780?'Hoy abrimos a las 13:00':'Hoy abrimos a las 20:00';if(day==='Sun')text=minute>=810&&minute<990?'Abierto · hasta las 16:30':minute<810?'Hoy abrimos a las 13:30':'Hoy cerrado';output.textContent=text}

const track=document.querySelector('#house-track');if(track){document.querySelector('.gallery-prev')?.addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.8,behavior:paused||preference.matches?'instant':'smooth'}));document.querySelector('.gallery-next')?.addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.8,behavior:paused||preference.matches?'instant':'smooth'}));}


import './experience.js';
