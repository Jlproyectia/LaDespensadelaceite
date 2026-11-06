import fs from 'node:fs';
let js=fs.readFileSync('src/site.js','utf8');
const start=js.indexOf('if(search){'),end=js.indexOf("const output=",start);
js=js.slice(0,start)+`if(search){
let selected='all';
const clean=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const filter=()=>{const value=clean(search.value.trim());let count=0;document.querySelectorAll('[data-menu-category]').forEach(section=>{let visible=0;section.querySelectorAll('.menu-row').forEach(row=>{row.hidden=!clean(row.dataset.name).includes(value);if(!row.hidden)visible++});section.hidden=visible===0||(selected!=='all'&&section.id!==selected);section.classList.toggle('is-selected',selected===section.id);if(!section.hidden)count+=visible});document.querySelector('.search-status').textContent=value||selected!=='all'?(count?count+' platos disponibles':'No encontramos ese plato. Prueba otro nombre o categoría.'):'';clear.hidden=!value;document.querySelectorAll('[data-category]').forEach(b=>{const active=b.dataset.category===selected;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))})};
search.addEventListener('input',filter);clear.addEventListener('click',()=>{search.value='';filter();search.focus()});
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();selected=b.dataset.category;filter()}));
if(location.hash&&document.querySelector(location.hash)?.matches('[data-menu-category]')){selected=location.hash.slice(1);filter()}
const beforePrint=()=>{selected='all';search.value='';filter()};document.querySelector('.print-menu')?.addEventListener('click',()=>{beforePrint();print()});addEventListener('beforeprint',beforePrint);
}
const tabs=[...document.querySelectorAll('.kitchen-tabs [role=tab]')];
function chooseTab(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active});const panel=document.getElementById(tab.getAttribute('aria-controls'));if(!paused&&!preference.matches){const a=panel.animate([{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:500,easing:'ease-out'});animations.add(a);a.finished.finally(()=>animations.delete(a))}}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>chooseTab(tab));tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();chooseTab(tabs[n]);tabs[n].focus()})});
`+js.slice(end);
fs.writeFileSync('src/site.js',js);
let build=fs.readFileSync('build.mjs','utf8').replace('href="site.css"','href="site.css?v=3"');fs.writeFileSync('build.mjs',build);
