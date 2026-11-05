import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const sharp=require('sharp');
const dir='C:/Users/Leviç/.codex/generated_images/01a1ac52-ea3d-7de1-893b-05e61b72979d';
const files={ibericos:'exec-0c0e3c2f-fe3d-4566-bb43-48bb8c94a74c.png',carnes:'exec-7ce8cf4d-bc1a-472f-9e7a-8632cf716bae.png',fachada:'exec-1da9b725-3ea2-4bd9-8433-39b92612b2ca.png',croquetas:'exec-ed74204a-d149-4714-9c93-d960f019b6f6.png',terraza:'exec-7d47cdfc-bf3c-48da-86d8-51b3f7a06b3c.png'};
fs.mkdirSync('source-images',{recursive:true});fs.mkdirSync('dist/images',{recursive:true});
for(const [name,file]of Object.entries(files)){fs.copyFileSync(path.join(dir,file),`source-images/${name}.png`);for(const width of [640,1536]){const target=`dist/images/${name}${width===640?'-640':''}.webp`;await sharp(`source-images/${name}.png`).resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(target);console.log(target,Math.round(fs.statSync(target).size/1024)+' KB')}}
