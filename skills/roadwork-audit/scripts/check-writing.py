#!/usr/bin/env python3
"""check-writing.py — the mechanical parts of a writing audit: --paths, --instance-free. One final token: '<FIRST-MODE> OK' when every named mode passed, else '<MODE> FAIL: <reason>'.
Defaults from the register, found upward from the working directory (the nearest folder holding ordering.md and working.md, or holding roadwork/ with both): --strings its docs/local/instance-strings.txt; --root the project's root, the register's folder resolved through the setting
project-root (unset `..`), read through the config script. Under --paths every path token is tested for existence under the root:
the token itself, or, where it holds a placeholder `<`, its literal part before the first `<`, cut back to its last `/` where that
part holds one, an empty literal passing; no prefix is required."""
import sys, os, re, argparse, subprocess
HERE=os.path.dirname(os.path.abspath(__file__))
CONFIG_MJS=os.path.normpath(os.path.join(HERE,'..','..','roadwork-config','scripts','config.mjs'))
def given_cwd():
    """The working directory as given: $PWD where it names the working directory (a shell keeps it so), never resolved through a link; else the OS's."""
    p=os.environ.get('PWD','')
    try:
        if os.path.isabs(p) and os.path.samefile(p,'.'): return p
    except OSError: pass
    return os.getcwd()
def find_register():
    d=given_cwd()
    while True:
        for r in (os.path.join(d,'roadwork'), d):
            if os.path.isfile(os.path.join(r,'ordering.md')) and os.path.isfile(os.path.join(r,'working.md')): return r
        parent=os.path.dirname(d)
        if parent==d: return None
        d=parent
def register():
    r=find_register()
    if r is None: print(f'USAGE FAIL: no register found above {given_cwd()} (a folder holding ordering.md and working.md); pass --strings and --root'); sys.exit(2)
    return r
def setting(reg, key):
    cfg=os.path.join(reg,'config.json')
    if not os.path.isfile(cfg): return ''
    try: r=subprocess.run(['node',CONFIG_MJS,'--config-file',cfg,'get',key],capture_output=True,text=True)
    except OSError: return ''
    v=r.stdout.strip() if r.returncode==0 else ''
    return '' if v=='empty' else v
p=argparse.ArgumentParser(); p.add_argument('--doc',required=True); p.add_argument('--root',default=None); p.add_argument('--strings',default=None); p.add_argument('--paths',action='store_true'); p.add_argument('--instance-free',action='store_true')
a=p.parse_args(); modes=[m for m,on in (('PATHS',a.paths),('INSTANCE-FREE',a.instance_free)) if on]
if not modes: print('USAGE FAIL: name --paths and/or --instance-free'); sys.exit(2)
if not os.path.isfile(a.doc): print(f'{modes[0]} FAIL: document missing'); sys.exit(1)
if a.paths and a.root is None: reg=register(); a.root=os.path.normpath(os.path.join(reg,setting(reg,'project-root') or '..'))
if a.instance_free and a.strings is None: a.strings=os.path.join(register(),'docs','local','instance-strings.txt')
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
            if re.match(r'^(change|origin|refs|main)/',t): continue      # a history reference, not a path
            if t.startswith('/') or t.startswith('...'): fail('PATHS',f'line {i}: `{t}` opens with a slash or an ellipsis')
            lit=t.split('<',1)[0]
            if '<' in t and '/' in lit: lit=lit[:lit.rindex('/')+1]
            if lit and not os.path.exists(os.path.join(a.root,lit)): fail('PATHS',f'line {i}: `{t}` names no path under the root {a.root}')
if a.instance_free:
    if not os.path.isfile(a.strings): fail('INSTANCE-FREE',f'strings list missing: {a.strings}')
    for s in [x.strip() for x in open(a.strings,encoding='utf-8') if x.strip() and not x.startswith('#')]:
        if re.search(r'(?<![\w-])'+re.escape(s)+r'(?![\w-])',text): fail('INSTANCE-FREE',f'instance string {s!r} present')
print(f'{modes[0]} OK')
