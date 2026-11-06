import fs from 'node:fs';import sharp from 'sharp';
const manifest=JSON.parse(fs.readFileSync('data/editorial-images.json','utf8'));
for(const {slug,path} of manifest){const dest='source-images/editorial-'+slug+'.png';fs.copyFileSync(path,dest);for(const width of [320,640,960,1536])await sharp(dest).resize({width}).webp({quality:82,effort:5}).toFile('dist/images/editorial-'+slug+(width===1536?'':'-'+width)+'.webp')}
console.log('Imported '+manifest.length+' new editorial images with responsive variants.');
// Contact sheet is for visual QA only; generated image content is not edited.
const tiles=await Promise.all(manifest.map(async({slug})=>({input:await sharp('source-images/editorial-'+slug+'.png').resize(384,256).toBuffer()})));
await sharp({create:{width:1536,height:Math.ceil(tiles.length/4)*256,channels:3,background:'#fff'}}).composite(tiles.map((t,i)=>({...t,left:(i%4)*384,top:Math.floor(i/4)*256}))).png().toFile('shots/editorial-contact.png');
