import fs from 'node:fs';import sharp from 'sharp';
const manifest=JSON.parse(fs.readFileSync('data/local-v7.json','utf8'));
for(const {slug,path} of manifest){fs.copyFileSync(path,'source-images/'+slug+'.png');for(const width of [320,640,960,1536,3840]) await sharp(path).resize({width}).webp({quality:width===3840?86:83,effort:5}).toFile('dist/images/'+slug+(width===1536?'':width===3840?'-4k':'-'+width)+'.webp');}
let s=fs.readFileSync('redesign.mjs','utf8');
s=s.replace("const asset=name=>{const n=replacements[name]||name;", "const localPhotos={'editorial-fachada':'local-terraza-v7','entrada-local':'local-comedor-v7','terraza':'local-terraza-v7','rincon-terraza':'local-rincon-v7'};\nconst asset=name=>{if(localPhotos[name])return localPhotos[name];if(name.endsWith('-v7'))return name;const n=replacements[name]||name;");
const gallery=[['local-terraza-v7','Nuestra terraza'],['local-comedor-v7','El comedor'],['local-rincon-v7','Un rincón para quedarse'],['local-jamones-v7','El rincón de los ibéricos'],['editorial-ibericos','Ibéricos de Los Pedroches'],['editorial-ensaladas','Del huerto'],['editorial-delicatessen','Croquetas de la casa'],['editorial-pescados','Del mar'],['editorial-cerdo','Cerdo ibérico'],['editorial-brochetones','A la parrilla'],['editorial-postres','El final dulce'],['editorial-acompanamientos','Pan y aceite']];
s=s.replace(/const galleryItems=\[[^\n]+;/,'const galleryItems='+JSON.stringify(gallery)+';');
s=s.replace('Los platos, la terraza y los pequeños detalles.<br>Un primer vistazo a lo que te espera.','Nuestra terraza, el comedor y la barra de ibéricos.<br>Conoce los rincones de La Despensa.');
s=s.replace('site.js?v=6','site.js?v=7');
fs.writeFileSync('redesign.mjs',s);
let b=fs.readFileSync('build.mjs','utf8').replace('site.css?v=6','site.css?v=7');fs.writeFileSync('build.mjs',b);
console.log('Integrated four regenerated real restaurant views.');
