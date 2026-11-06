import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {scryptSync,randomBytes} from 'node:crypto';
import {createAdminService} from '../server/admin-service.mjs';
import {initialState} from '../server/admin-seed.mjs';
const port=Number(process.env.PORT||4174),root=path.resolve('dist'),directory=path.resolve('.local-admin');
await fs.mkdir(directory,{recursive:true});
let state;try{state=JSON.parse(await fs.readFile(path.join(directory,'state.json'),'utf8'));}catch{state=initialState();}
let queue=Promise.resolve();
const store={read:async()=>structuredClone(state),transaction(change){const result=queue.then(async()=>{const draft=structuredClone(state),value=await change(draft);await fs.writeFile(path.join(directory,'state.json'),JSON.stringify(draft));state=draft;return value;});queue=result.catch(()=>{});return result;}};
const salt=randomBytes(16).toString('hex');const env={APP_ORIGIN:`http://127.0.0.1:${port}`,ADMIN_SESSION_SECRET:randomBytes(48).toString('hex'),ADMIN_PIN_HASH:salt+':'+scryptSync(process.env.DEV_ADMIN_PIN||'5555',salt,64).toString('hex')};
const handle=createAdminService({store,env,uploadImage:async(bytes,type)=>{const ext={'image/webp':'webp','image/png':'png','image/jpeg':'jpg'}[type],id=crypto.randomUUID()+'.'+ext;await fs.writeFile(path.join(directory,id),bytes);return '/api/app?action=media&id='+id;},fetchImage:async id=>{if(!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(id))return null;try{return {stream:await fs.readFile(path.join(directory,id)),blob:{contentType:{jpg:'image/jpeg',png:'image/png',webp:'image/webp'}[id.split('.').at(-1)]}};}catch{return null;}}});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{
 if(req.url.startsWith('/api/app')){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>3000000){res.writeHead(413);res.end();return;}chunks.push(chunk);}const request=new Request(new URL(req.url,env.APP_ORIGIN),{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});const reply=await handle(request);res.writeHead(reply.status,Object.fromEntries(reply.headers));res.end(Buffer.from(await reply.arrayBuffer()));return;}
 const url=new URL(req.url,env.APP_ORIGIN);let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(file===root)file=path.join(root,'index.html');if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local admin and website: ${env.APP_ORIGIN}/admin.html (local storage only)`));
