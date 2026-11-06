import fs from 'node:fs';import sharp from 'sharp';
const hero=JSON.parse(fs.readFileSync('data/hero-v6.json','utf8'));
fs.copyFileSync(hero.path,'source-images/hero-despensa.png');
for(const width of [320,640,960,1536]) await sharp(hero.path).resize({width}).webp({quality:85}).toFile('dist/images/hero-despensa'+(width===1536?'':'-'+width)+'.webp');
const pages=fs.readdirSync('dist').filter(f=>f.endsWith('.html')).map(f=>fs.readFileSync('dist/'+f,'utf8')).join('');
const names=new Set([...pages.matchAll(/<img[^>]+src="images\/([^"/]+)\.webp"/g)].map(m=>m[1]));names.add('hero-despensa');
const audit=[];
for(const name of names){const source=fs.existsSync('source-images/'+name+'.png')?'source-images/'+name+'.png':'dist/images/'+name+'.webp';const meta=await sharp(source).metadata();await sharp(source).resize({width:3840,kernel:'lanczos3'}).webp({quality:86,effort:5}).toFile('dist/images/'+name+'-4k.webp');audit.push({name,sourceWidth:meta.width,outputWidth:3840,method:'Lanczos resampling, not native 4K generation'});}
fs.writeFileSync('data/4k-assets.json',JSON.stringify(audit,null,2));console.log('Prepared '+audit.length+' images at 3840px wide, preserving aspect ratio.');
