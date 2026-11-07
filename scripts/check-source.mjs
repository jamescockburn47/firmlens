import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
async function check(dir){for(const item of await readdir(dir,{withFileTypes:true})){
 const file=path.join(dir,item.name);if(item.isDirectory()){await check(file);continue;}
 if(!/\.(tsx?|mjs|css)$/.test(file))continue;
 const lines=(await readFile(file,'utf8')).split(/\r?\n/).filter(line=>line.trim()).length;
 if(lines>300)throw new Error(`${file}: ${lines} nonblank lines exceeds 300`);
}}
for(const dir of ['app','components','lib','scripts','tests'])await check(dir);
console.log('Authored application files satisfy the 300 nonblank line limit.');
