#!/usr/bin/env python3
"""dispatch-plan.py — prints the reader prompts, one per question of the kind (five; six for truth with `--referent`, the Omission question left out without it), for one document and one kind. Dispatches nothing: the session agent sends each prompt through the host's Agent tool.

For truth and continuity every reader is given the sources as their paths name them, read from the project's working copy: the paths given with `--sources`, and for truth the copy of every file pair of the register's `docs/local/twins.txt` (one pair per line, the document's path then the copy's, whitespace between, both from the project root; `#` lines comments; no file, no twins; a pair whose copy is a folder adds nothing here). Writing takes no sources. Writes only the referent listing under <report-dir>/sources/ when `--referent` is given.

The project root: `--root`; else the register found upward from the working directory (the nearest folder holding ordering.md and working.md, or holding roadwork/ with both) resolved through its setting `project-root` (unset `..`), read through the config script.

With `--referent <folder>` (truth, continuity; spec R7 of documentary items checked against their referent) it runs list-referent.mjs, beside this script, writing the folder's listing to <report-dir>/sources/referent-<folder's last segment>.txt and gives the listing to every reader as a source, after the `--sources`.
"""
import sys, os, argparse, re, subprocess
HERE=os.path.dirname(os.path.abspath(__file__)); SKILL=os.path.dirname(HERE)
CONFIG_MJS=os.path.normpath(os.path.join(SKILL,'..','roadwork-config','scripts','config.mjs'))

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

def setting(reg, key):
    cfg=os.path.join(reg,'config.json')
    if not os.path.isfile(cfg): return ''
    try: r=subprocess.run(['node',CONFIG_MJS,'--config-file',cfg,'get',key],capture_output=True,text=True)
    except OSError: return ''
    v=r.stdout.strip() if r.returncode==0 else ''
    return '' if v=='empty' else v

def find_root(reg):
    if reg is None: return None
    return os.path.normpath(os.path.join(reg, setting(reg,'project-root') or '..'))

def read_twins(reg):
    """The pairs of <register>/docs/local/twins.txt: [(document, copy)], each a path from the project root."""
    f=os.path.join(reg,'docs','local','twins.txt') if reg else None
    if not f or not os.path.isfile(f): return []
    pairs=[]
    for line in open(f,encoding='utf-8'):
        s=line.strip()
        if not s or s.startswith('#'): continue
        parts=s.split()
        if len(parts)!=2: print(f'DISPATCH FAIL: {f}: a line takes a document path and a copy path, got: {s}'); sys.exit(1)
        pairs.append((parts[0].rstrip('/'), parts[1].rstrip('/')))
    return pairs

def relpath(p, root):
    a=os.path.abspath(p if os.path.isabs(p) else os.path.join(root,p))
    r=os.path.relpath(a,root)
    return (r if not r.startswith('..') else a), a

p=argparse.ArgumentParser()
p.add_argument('--doc',required=True); p.add_argument('--kind',required=True,choices=['writing','truth','continuity'])
p.add_argument('--sources',nargs='*',default=[]); p.add_argument('--report-dir',default='audit')
p.add_argument('--root',default=None,help="the project root (default: the register found upward from the working directory, resolved through its setting project-root)")
p.add_argument('--referent',default=None,metavar='FOLDER',help="the document's folder referent (truth, continuity): its listing, by list-referent.mjs, written to <report-dir>/sources/referent-<last segment>.txt and given to every reader as a source")
a=p.parse_args()
REGISTER=find_register()
root=os.path.abspath(a.root) if a.root else find_root(REGISTER)
if not root: print('DISPATCH FAIL: no project root found; pass --root'); sys.exit(1)
TWINS=read_twins(REGISTER)
STANDING=[c for d,c in TWINS if not os.path.isdir(os.path.join(root,c))]
doc=os.path.abspath(a.doc) if os.path.isabs(a.doc) or os.path.isfile(a.doc) else os.path.join(root,a.doc)
if not os.path.isfile(doc): print('DISPATCH FAIL: document does not exist: '+doc); sys.exit(1)
if a.referent is not None and a.kind=='writing': print('DISPATCH FAIL: --referent takes a truth or continuity audit'); sys.exit(1)
brief=open(os.path.join(SKILL,'texts','reader-brief.md'),encoding='utf-8').read().strip()
qs=[l for l in open(os.path.join(SKILL,'texts',f'questions-{a.kind}.md'),encoding='utf-8').read().split('\n') if re.match(r'^\d\. ',l)]
if a.referent is None: qs=[q for q in qs if not re.sub(r'^\d\. ','',q).startswith('Omission')]  # the Omission question reads the referent listing; none without --referent
sources=list(a.sources)
for c in STANDING:
    if a.kind=='truth' and c not in ' '.join(sources): sources.append(c)

read_paths=[]; names=[]
if a.kind!='writing':
    for s in sources:
        rel,absp=relpath(s,root)
        if not os.path.isfile(absp): print('DISPATCH FAIL: source does not exist: '+absp); sys.exit(1)
        if absp not in read_paths: read_paths.append(absp); names.append(rel)  # one read path per distinct file, in order
    if a.referent is not None:
        ref=os.path.abspath(a.referent if os.path.isabs(a.referent) or os.path.isdir(a.referent) else os.path.join(root,a.referent))
        if not os.path.isdir(ref): print('DISPATCH FAIL: referent is not a folder: '+ref); sys.exit(1)
        os.makedirs(os.path.join(a.report_dir,'sources'),exist_ok=True)
        listing=os.path.abspath(os.path.join(a.report_dir,'sources',f'referent-{os.path.basename(ref)}.txt'))
        r=subprocess.run(['node',os.path.join(HERE,'list-referent.mjs'),ref,'--out',listing],capture_output=True,text=True)
        if r.returncode: print('DISPATCH FAIL: list-referent.mjs: '+(r.stderr.strip() or f'exit {r.returncode}')); sys.exit(1)
        read_paths.append(listing); names.append(f'referent {relpath(ref,root)[0]} listing')

for i,q in enumerate(qs,1):
    text=brief.replace('<document>',doc).replace('<question>',re.sub(r'^\d\. ','',q)).replace('<report path>',os.path.join(a.report_dir,f'q{i}.md'))
    if a.kind=='writing': text=re.sub(r' \[truth, continuity: [^\]]*\]','',text)
    else: text=re.sub(r'\[truth, continuity: ([^\]]*)\]',r'\1',text).replace('<sources>',', '.join(read_paths)).replace('<versions>','; '.join(f'{n}, as it stands at its path' for n in names))
    print(f'--- prompt {i} ---'); print(text)
print(f'--- {len(qs)} prompts, nothing dispatched ---')
