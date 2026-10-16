#!/usr/bin/env python3
"""dispatch-plan.py — prints the five reader prompts for one document and one kind. Dispatches nothing: the session agent sends each prompt through the harness's Agent tool."""
import sys, os, argparse, re
HERE=os.path.dirname(os.path.abspath(__file__)); SKILL=os.path.dirname(HERE)
CONST='nethub/reference/repos/buzz-agentic-architecture/docs/constitution.md'
p=argparse.ArgumentParser(); p.add_argument('--doc',required=True); p.add_argument('--kind',required=True,choices=['writing','truth','continuity']); p.add_argument('--sources',nargs='*',default=[]); p.add_argument('--report-dir',default='audit')
a=p.parse_args()
doc=os.path.abspath(a.doc)
if not os.path.isfile(doc): print('DISPATCH FAIL: document does not exist: '+doc); sys.exit(1)
brief=open(os.path.join(SKILL,'texts','reader-brief.md'),encoding='utf-8').read().strip()
qs=[l for l in open(os.path.join(SKILL,'texts',f'questions-{a.kind}.md'),encoding='utf-8').read().split('\n') if re.match(r'^\d\. ',l)]
sources=list(a.sources)
if a.kind=='truth' and CONST not in ' '.join(sources): sources.append(CONST)
for i,q in enumerate(qs,1):
    text=brief.replace('<document>',doc).replace('<question>',re.sub(r'^\d\. ','',q)).replace('<report path>',os.path.join(a.report_dir,f'q{i}.md'))
    if a.kind=='writing': text=re.sub(r' \[truth, continuity: [^\]]*\]','',text)
    else: text=re.sub(r'\[truth, continuity: ([^\]]*)\]',r'\1',text).replace('<sources>',', '.join(sources))
    print(f'--- prompt {i} ---'); print(text)
print(f'--- {len(qs)} prompts, nothing dispatched ---')
