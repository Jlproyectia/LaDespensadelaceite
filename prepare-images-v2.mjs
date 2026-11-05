import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const sharp=require('sharp');
const jobs=[
  {
    "slug": "entrecot",
    "reference": "research\\ref-2.jpg",
    "prompt": "Recreate the actual steak plate in the reference as premium natural editorial restaurant photography. Keep same grilled entrecote, homemade fries and modest mixed vegetable garnish, ivory ceramic plate with terracotta rim. Entire plate in a horizontal 3:2 composition on warm honey wood table, 45 degree camera, soft side window light, rich appetizing real texture. No cartoon sticker, no overlay, no typography, no people. Preserve generous rustic serving, not fine dining. New photograph not merely a crop.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-b685a656-467c-4fc0-8a85-2d0810836e1a.png"
  },
  {
    "slug": "brochetas",
    "reference": "research\\ref-3.jpg",
    "prompt": "Recreate the two orange marinated grilled chicken skewers and homemade fries in the reference as polished natural restaurant editorial photograph. Preserve two metal skewers and ivory crackled oval ceramic with brown rim. Horizontal 3:2, entire plate on honey wood table, 35 degree view, beautiful warm daylight, true food texture, crisp focus on meat, soft background. No cartoon, watermark, typography, added garnish or people. New professional photo.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-570020f4-7597-4c6d-a620-d2554549b687.png"
  },
  {
    "slug": "ensalada-caballa",
    "reference": "research\\ref-5.jpg",
    "prompt": "Recreate the actual tomato and mackerel salad from reference as premium restaurant editorial photography. Keep irregular ripe red tomato wedges and two pale mackerel fillets with skin, olive oil sheen, white rustic plate. Horizontal 3:2 photograph on honey wooden table, intimate three quarter overhead framing, natural soft sunny light, appetizing real textures. No extra greens or ingredients, no cartoon, no text overlays, no people.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-0618406f-958c-48fa-9cd6-ac2127120c51.png"
  },
  {
    "slug": "esparragos",
    "reference": "research\\ref-7.jpg",
    "prompt": "Recreate the actual asparagus dish from reference as premium natural restaurant food photography. Preserve green asparagus, melted lightly golden goat cheese and red caramelized pepper strips on glazed warm terracotta oval platter. Horizontal3:2, three quarter overhead angle on rustic honey wood table, beautifully soft Mediterranean daylight, realistic proportions and food texture. No sticker, graphic overlay, extra ingredients or people.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-24944084-0467-4f27-8729-7c9ce67f1ce6.png"
  },
  {
    "slug": "jamon",
    "reference": "research\\ref-6.jpg",
    "prompt": "Create a new premium editorial food photograph recreating this real plate of Spanish jamon. Preserve the generous overlapping thin red and white marbled slices on warm terracotta round platter. Horizontal3:2, overhead diagonal composition, plate fills frame, honey wood table, warm soft window light with deep natural shadows, bread in background. No beer branding, no cartoon, no typography or people. Real appetizing irregular textures, refined photography not refined plating.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-e6ce665c-edc3-4767-99e2-1d8005b0ad66.png"
  },
  {
    "slug": "queso",
    "reference": "web\\source-images\\ibericos.png",
    "prompt": "Create a new restaurant editorial close-up of the cured sheep cheese wedges from this reference. Preserve exact pale ivory cheese texture and triangular wedges with darker natural rind. Fan of cheese wedges on same rustic ceramic cream brown rim plate, edge of jamon in soft background. New low three-quarter macro composition horizontal3:2, warm wood and soft side daylight, exquisite natural texture. No new ingredients, no text, no people.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-e2408c5b-5665-4cf5-aeee-c8688d36b45d.png"
  },
  {
    "slug": "aceite-pan",
    "reference": "web\\source-images\\ibericos.png",
    "prompt": "Create a new premium editorial still life photograph of the bread basket and olive oil saucer from this reference. Make those the focus: rustic crusty bread in wicker basket, white shallow ceramic saucer filled with golden green olive oil, honey wood table. Low intimate angle, horizontal3:2, soft golden morning side light with natural shadows and tactile bread crust, Mediterranean Spanish restaurant atmosphere. No extra ingredients, no text, no people.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-25f2101a-2193-4dff-9c76-3b3d3c586e37.png"
  },
  {
    "slug": "croquetas-detalle",
    "reference": "web\\source-images\\croquetas.png",
    "prompt": "Create a new premium natural editorial close-up of the actual croquettes in reference, preserving golden coarse breadcrumb crust and rustic irregular oval shape. Two croquettes prominent foreground with others and homemade fries softly receding behind on same terracotta plate and honey wood table. Horizontal3:2, very low three-quarter lens, tactile crisp texture, soft directional window light, shallow depth. No cut-open filling invented, no garnish, no typography, no people.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-c4fcf857-ba2f-4ef8-8210-7a8fa1fac85d.png"
  },
  {
    "slug": "parrilla-detalle",
    "reference": "research\\ref-1.jpg",
    "prompt": "Create a new professional restaurant editorial photograph of the actual mixed grilled meat from the reference. Preserve the assortment of browned pork cuts, orange marinated chicken and chorizo on glazed terracotta platter. New tight low angle horizontal3:2 detail emphasizing juicy seared meat, shallow depth, distant bowl of fries softly blurred. Warm honey wood table, soft side daylight, rustic and appetizing not fine dining. No cartoon, no extra garnish, no text.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-67d17431-36cb-412c-ab3a-ba135d789f1c.png"
  },
  {
    "slug": "mesa-ibericos",
    "reference": "web\\source-images\\ibericos.png",
    "prompt": "Create a new elegant wide editorial overhead photograph of this same restaurant meal for sharing. Same rustic brown rim ivory platter of thin jamon and sheep cheese, same bread basket and little olive oil saucer, on warm honey wood table, now composed diagonally with generous tabletop breathing room for a website hero. Horizontal3:2, luxurious natural side lighting, true food texture and real portions. No extra food types, no hands, no people, no typography.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-17f7796d-b706-48b6-b4ba-3ea9b667c6b4.png"
  },
  {
    "slug": "rincon-terraza",
    "reference": "web\\source-images\\terraza.png",
    "prompt": "Create a new photographic detail of this exact Spanish restaurant terrace. Focus closely on one barrel high table with white tabletop, wicker bread basket and dark wooden chairs, green window frames and warm lit stone wall softly behind. Preserve building materials, color, furniture and modest street setting. Horizontal3:2 editorial architecture photograph, lovely dusk atmosphere, natural warm light. No new architecture or furniture, no people, no text overlay.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-f72f461d-3996-4e7b-9595-0556b8a3f424.png"
  },
  {
    "slug": "entrada-local",
    "reference": "web\\source-images\\fachada.png",
    "prompt": "Create a new editorial architectural photograph focusing on the entrance of this same restaurant. Preserve exact green painted surrounds, wooden doorway, yellow facade, terracotta details and trees; intimate approach from terrace to entrance, softly lit interior, natural afternoon light. Horizontal3:2, straight architectural lines, tactile materials, tasteful restaurant brand photography. Keep any visible business sign reading La Despensa del Aceite, no new signs or added architecture, no people or text overlays.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-d11f8b7d-44ac-4029-8a8c-a9afb197915a.png"
  },
  {
    "slug": "patatas-caseras",
    "reference": "research\\ref-2.jpg",
    "prompt": "Create a new premium editorial detail photograph focusing on the homemade handcut fried potatoes visible in this reference. Keep the irregular pale golden potato sticks with crisp edges on ivory ceramic plate with terracotta rim, edge of grilled steak softly visible in background. Horizontal3:2, warm honey wood restaurant table, natural soft side sunlight, realistic appetizing texture, shallow depth. No extra toppings, no new garnish, no cartoon, no text, no people.",
    "generatedPath": "C:\\Users\\Leviç\\.codex\\generated_images\\01a1ad95-b08d-7160-918c-4e49ab290738\\exec-0f2e1ba8-013d-4e74-8dc9-f8b3c766fd64.png"
  }
];
for(const j of jobs){const output=path.join('source-images',j.slug+'.png');fs.copyFileSync(j.generatedPath,output);for(const w of [1536,640])await sharp(output).resize({width:w}).webp({quality:w===1536?82:80,effort:5}).toFile(path.join('dist/images',j.slug+(w===640?'-640':'')+'.webp'));console.log(j.slug);}
fs.writeFileSync('data/images-v2.json',JSON.stringify(jobs.map(({generatedPath,...j})=>({...j,source:'source-images/'+j.slug+'.png',image:'images/'+j.slug+'.webp'})),null,2));

