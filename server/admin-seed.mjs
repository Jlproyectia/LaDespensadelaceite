import menu from '../data/menu.json' with {type:'json'};
import translations from '../data/ui-en.json' with {type:'json'};
const ids=['ibericos','ensaladas','delicatessen','pescados','cerdo-iberico','ternera','brochetones','alpargatas','infantil','postres','extras'];
const images=['editorial-ibericos','editorial-ensaladas','editorial-delicatessen','editorial-pescados','editorial-cerdo','editorial-ternera','editorial-brochetones','editorial-alpargatas','editorial-infantil','editorial-postres','editorial-acompanamientos'];
const sections=[...menu.sections,{name:'Pan y acompañamientos',items:menu.extras}];
export const categories=sections.map((s,i)=>({id:ids[i],es:s.name,en:translations[s.name]||s.name,version:1}));
const photos=new Map([
 [0,5,'editorial-ibericos'],[1,3,'editorial-ensaladas'],[2,4,'editorial-delicatessen'],[3,1,'editorial-pescados'],[4,1,'editorial-cerdo'],[5,1,'editorial-ternera'],[6,0,'editorial-brochetones'],[7,0,'editorial-alpargatas'],[8,0,'editorial-infantil'],[9,0,'editorial-postres'],[10,0,'editorial-acompanamientos'],
 [0,7,'dish-queso'],[0,2,'dish-lomo'],[1,1,'dish-ensaladilla'],[2,3,'dish-pate'],[2,1,'dish-mojama'],[2,2,'dish-atun'],[2,6,'dish-flamenquin'],[2,8,'dish-huevos'],[2,9,'dish-revuelto'],[2,10,'dish-anchoas'],[3,0,'dish-merluza'],[3,2,'dish-bacalao'],[4,3,'dish-solomillo'],[4,0,'dish-presa'],[5,0,'dish-chuleton'],[7,3,'dish-toston'],[9,1,'dish-tres-chocolates'],[9,2,'dish-brownie'],[9,3,'dish-coulant'],[9,4,'dish-zanahoria'],[9,5,'dish-helado']
].map(([s,i,image])=>[`${s}-${i}`,image]));
export function seedProducts(){return sections.flatMap((section,s)=>section.items.map((item,i)=>({id:`dish-${s}-${i}`,category:ids[s],name:item.name,nameEn:translations[item.name]||item.name,description:item.description||'',descriptionEn:translations[item.description]||item.description||'',price:item.note?null:item.price,half:item.half??null,unit:item.unit?'each':'portion',active:true,featured:photos.has(`${s}-${i}`),image:`images/${photos.get(`${s}-${i}`)||images[s]}.webp`,order:s*100+i,version:1})));}
export const initialState=()=>({schema:1,products:seedProducts(),bookings:[],limits:{},audit:[],content:{},categories:structuredClone(categories)});
