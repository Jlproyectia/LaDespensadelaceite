import fs from 'node:fs';import sharp from 'sharp';
for(const file of fs.readdirSync('dist/images').filter(f=>f.endsWith('.webp')&&!/-\d+\.webp$/.test(f))){const stem=file.slice(0,-5);const png='source-images/'+stem+'.png';const input=fs.existsSync(png)?png:'dist/images/'+file;for(const width of [320,960])await sharp(input).resize({width}).webp({quality:76,effort:6}).toFile(`dist/images/${stem}-${width}.webp`)}
console.log('Responsive 320 and 960 px variants prepared.');
