import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
http.createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p==='/')p='/index.html';const full=path.resolve(root,'.'+p);if(!full.startsWith(root+path.sep))throw Error('Forbidden');const data=await fs.readFile(full);res.writeHead(200,{'Content-Type':types[path.extname(full)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)}catch(e){res.writeHead(404);res.end('Not found')}}).listen(port,()=>console.log('MakeFast: http://localhost:'+port));
