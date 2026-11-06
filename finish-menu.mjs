import fs from 'node:fs';
let s=fs.readFileSync('redesign.mjs','utf8');
const visit=s.match(/<section class="visit-section wrap" id="visit">[\s\S]*?<\/section>/)[0];
const dessert='<section class="dessert-feature wrap"><div>${photo(\'dish-brownie\',\'Brownie con helado, recreación con IA\')}</div><div><p class="eyebrow">Siempre queda un hueco</p><h2>El final,<br><em>que sea dulce.</em></h2><p>Tarta de queso, tres chocolates o un brownie con helado. Elige cómo terminar la sobremesa.</p>${link(\'#postres\',\'Descubre nuestros postres\')}</div></section>';
s=s.replace("</p></div></div>`,'menu-page');","</p></div></div>"+dessert+visit+"`,'menu-page');");
fs.writeFileSync('redesign.mjs',s);
fs.appendFileSync('src/site.css','\n.dessert-feature{display:grid;grid-template-columns:1fr 1fr;gap:8%;align-items:center;padding-block:80px}.dessert-feature img{width:100%;aspect-ratio:4/3;object-fit:cover}.dessert-feature p:not(.eyebrow){max-width:380px;color:var(--muted);margin:25px 0}.dessert-feature h2{font-size:clamp(42px,5vw,76px)}@media(max-width:600px){.dessert-feature{grid-template-columns:1fr;gap:32px;padding-block:45px}}\n');
