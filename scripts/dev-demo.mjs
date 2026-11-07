import {spawn} from 'node:child_process';
// Next checks port availability; set PORT if its default 3000 is unsuitable.
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1',...(process.env.PORT?['--port',process.env.PORT]:[])],{stdio:'inherit',env:{...process.env,FIRMLENS_DEMO:'1'}});
child.on('error',error=>{console.error(error.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
