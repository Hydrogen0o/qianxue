import re
s=open('index.src.html').read()
art=open('art.js').read().replace("if(typeof module!=='undefined')module.exports=P;","")
eng=open('td.js').read().replace("if(typeof module!=='undefined')module.exports=TD;","")
cg=open('cg.js').read().replace("if(typeof module!=='undefined')module.exports=CG;","")
import base64
s=s.replace('BGDATA','data:image/jpeg;base64,'+base64.b64encode(open('bg.jpg','rb').read()).decode())
s=s.replace('/*ART*/',art).replace('/*CORE*/',eng).replace('/*CG*/',cg).replace('/*CGUI*/',open('cgui.js').read())
open('记忆礁.html','w').write(s)
open('test.html','w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body style="margin:0">'+s+'</body></html>')
import os
os.makedirs('/home/claude/qianxue/reef/src',exist_ok=True)
open('/home/claude/qianxue/reef/index.html','w').write('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#061d26"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black"></head><body style="margin:0">'+s+'</body></html>')
import shutil
for f in ['td.js','cg.js','cgui.js','cgsim.js','art.js','index.src.html','build.py','tdsim.js']:shutil.copy(f,'/home/claude/qianxue/reef/src/'+f)
print(len(s))
