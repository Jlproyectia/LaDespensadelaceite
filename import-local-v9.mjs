import fs from 'node:fs';import sharp from 'sharp';
const manifest=JSON.parse(fs.readFileSync('data/local-v9.json','utf8'));
for(const {slug,path} of manifest){fs.copyFileSync(path,'source-images/'+slug+'.png');for(const width of [320,640,960,1536,3840])await sharp(path).resize({width}).webp({quality:width===3840?86:83,effort:5}).toFile('dist/images/'+slug+(width===1536?'':width===3840?'-4k':'-'+width)+'.webp');}
const tiles=await Promise.all(manifest.map(async({path},i)=>({input:await sharp(path).resize(384,256).toBuffer(),left:i%4*384,top:Math.floor(i/4)*256})));
await sharp({create:{width:1536,height:512,channels:3,background:'#fff'}}).composite(tiles).png().toFile('shots/local-v9-contact.png');console.log('Imported seven additional regenerated photographs.');
