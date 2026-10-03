const C=require('./cg.js');const {execSync}=require('child_process');
const sets=[[{p0:2,g:0,up:3,front:3,turns:10},{p0:3,g:0,up:3,front:3,turns:10},{p0:3,g:0,up:4,front:3,turns:12}],
 [{p0:3,g:0,up:3,front:3,turns:9},{p0:3,g:0,up:4,front:3,turns:10},{p0:4,g:0,up:4,front:3,turns:11}],
 [{p0:3,g:0,up:4,front:3,turns:9},{p0:4,g:0,up:4,front:3,turns:10},{p0:4,g:0,up:5,front:3,turns:11}]];
const fs=require('fs');const src=fs.readFileSync('cg.js','utf8');
for(const s of sets){const cfg=JSON.stringify(s.map((x,i)=>({n:['浅滩','礁坡','峭壁'][i],...x})));fs.writeFileSync('cg.js',src.replace(/let CFG=\[.*?\];/,'let CFG='+cfg+';'));console.log(JSON.stringify(s.map(x=>[x.p0,x.up,x.turns])));console.log(execSync('node cgsim.js 200').toString())}
fs.writeFileSync('cg.js',src);
