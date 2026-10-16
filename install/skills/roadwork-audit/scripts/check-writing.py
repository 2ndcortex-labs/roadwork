#!/usr/bin/env python3
"""check-writing.py — the mechanical parts of a writing audit: --paths, --instance-free. One final token: '<FIRST-MODE> OK' when every named mode passed, else '<MODE> FAIL: <reason>'."""
import sys, os, re, argparse
HERE=os.path.dirname(os.path.abspath(__file__))
DEFAULT_LIST=os.path.normpath(os.path.join(HERE,'..','..','..','..','nexus','roadwork','docs','local','instance-strings.txt'))
p=argparse.ArgumentParser(); p.add_argument('--doc',required=True); p.add_argument('--root-prefix',default='nethub/'); p.add_argument('--strings',default=DEFAULT_LIST); p.add_argument('--paths',action='store_true'); p.add_argument('--instance-free',action='store_true')
a=p.parse_args(); modes=[m for m,on in (('PATHS',a.paths),('INSTANCE-FREE',a.instance_free)) if on]
if not modes: print('USAGE FAIL: name --paths and/or --instance-free'); sys.exit(2)
if not os.path.isfile(a.doc): print(f'{modes[0]} FAIL: document missing'); sys.exit(1)
text=open(a.doc,encoding='utf-8').read(); lines=text.split('\n')
def fail(m,r): print(f'{m} FAIL: {r}'); sys.exit(1)
if a.paths:
    fenced=False
    for i,l in enumerate(lines,1):
        if l.startswith('```'): fenced=not fenced; continue
        if fenced: continue
        for m in re.finditer(r'`([^`]*)`',l):
            t=m.group(1)
            if '/' not in t or ' ' in t: continue
            if re.match(r'^/[a-z]+(-[a-z0-9]+)+$',t): continue          # a slash command
            if re.match(r'^(change|origin|refs|main)/',t): continue      # a git ref
            if t.startswith('/') or t.startswith('...'): fail('PATHS',f'line {i}: `{t}` opens with a slash or an ellipsis')
            if not t.startswith(a.root_prefix): fail('PATHS',f'line {i}: `{t}` not from {a.root_prefix}')
if a.instance_free:
    if not os.path.isfile(a.strings): fail('INSTANCE-FREE',f'strings list missing: {a.strings}')
    for s in [x.strip() for x in open(a.strings,encoding='utf-8') if x.strip() and not x.startswith('#')]:
        if re.search(r'(?<![\w-])'+re.escape(s)+r'(?![\w-])',text): fail('INSTANCE-FREE',f'instance string {s!r} present')
print(f'{modes[0]} OK')
