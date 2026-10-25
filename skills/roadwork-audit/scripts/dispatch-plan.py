#!/usr/bin/env python3
"""dispatch-plan.py — prints the reader prompts, one per question of the kind (five; six for truth with `--referent`, the Omission question left out without it), for one document and one kind. Dispatches nothing: the session agent sends each prompt through the host's Agent tool.

Before the prompts (truth, continuity) it prints one VERSION line per source — `<path>@<commit>` — and, for a twinned path, compares the three copies: the copy's HEAD, the document repository's local `main`, its working tree. The twins are the pairs of the register's `docs/local/twins.txt` (one pair per line, the document's path then the copy's, whitespace between, both from the project root; `#` lines comments; no file, no twins). A pair whose two paths are each the top folder of a git repository twins every path under either: equal and unmodified, one line, the copy read; differing, a COPY QUESTION per repository (named by the document path's last segment) and exit 2, nothing dispatched, until `--copy <repo>=<commons|main|working-tree>` names the copy (`commons` the pair's copy). Any other pair whose copy is not a folder names a copy every truth audit reads beside its sources. Writing prints no VERSION line. Reads git; fetches nothing; writes only the extracted `main` copy under <report-dir>/sources/ when that copy is chosen.

The project root: `--root`; else the register found upward from the working directory (the nearest folder holding ordering.md and working.md, or holding roadwork/ with both) resolved through its setting `project-root` (unset `..`), read through the config script.

With `--referent <folder>` (truth, continuity; spec R7 of documentary items checked against their referent) it runs list-referent.mjs, beside this script, writing the folder's listing to <report-dir>/sources/referent-<folder's last segment>.txt, prints `VERSION: referent <folder> listing sha256 <first twelve hex digits>` and gives the listing to every reader as a source, after the `--sources`.
"""
import sys, os, argparse, re, subprocess, hashlib
HERE=os.path.dirname(os.path.abspath(__file__)); SKILL=os.path.dirname(HERE)
CONFIG_MJS=os.path.normpath(os.path.join(SKILL,'..','roadwork-config','scripts','config.mjs'))
CHOICES=('commons','main','working-tree')

def git(args, cwd):
    r=subprocess.run(['git']+args, cwd=cwd, capture_output=True, text=True)
    return r.stdout.strip() if r.returncode==0 else None

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

def is_repo(path): return os.path.isdir(path) and git(['rev-parse','--show-toplevel'],path) is not None
def is_top(path): return is_repo(path) and os.path.samefile(git(['rev-parse','--show-toplevel'],path),path)

def twin(rel, root):
    """For a path under a repository pair's copy or under its document: (repo, document, copy, rest). Else None."""
    for doc,copy in REPO_TWINS:
        for base in (copy, doc):
            if rel.startswith(base+'/') and len(rel)>len(base)+1:
                return os.path.basename(doc), doc, copy, rel[len(base)+1:]
    return None

def copies(repo, doc, copy, rest, root):
    """The three copies of a twinned path: (label, version line, path to read or None, full commit)."""
    commons_dir=os.path.join(root,copy); clone=os.path.join(root,doc)
    c1=git(['rev-parse','HEAD'],commons_dir) or ''
    c2=git(['rev-parse','main'],clone) or ''
    c3=git(['rev-parse','HEAD'],clone) or ''
    branch=git(['rev-parse','--abbrev-ref','HEAD'],clone) or 'HEAD'
    modified=bool(git(['status','--porcelain','--',rest],clone))
    def short(c):
        if not c: return 'none'
        return git(['rev-parse','--short',c],clone) or git(['rev-parse','--short',c],commons_dir) or c[:7]
    crel=f'{copy}/{rest}'; wrel=f'{doc}/{rest}'
    return {
        'commons': (f'{crel}@{short(c1)}, the commons copy', os.path.join(commons_dir,rest), c1),
        'main': (f'{wrel}@{short(c2)}, the main copy', None, c2),
        'working-tree': (f'{wrel}@{branch} {short(c3)}{" modified" if modified else ""}, the working-tree copy', os.path.join(clone,rest), c3),
    }, (c1!='' and c1==c2==c3 and not modified), short(c1)

def version_untwinned(rel, absp, root):
    top=git(['rev-parse','--show-toplevel'],os.path.dirname(absp))
    if top is None: return f'{rel}@unversioned'
    return f'{rel}@{git(["rev-parse","--short","HEAD"],top) or "unversioned"}'

def relpath(p, root):
    a=os.path.abspath(p if os.path.isabs(p) else os.path.join(root,p))
    r=os.path.relpath(a,root)
    return (r if not r.startswith('..') else a), a

p=argparse.ArgumentParser()
p.add_argument('--doc',required=True); p.add_argument('--kind',required=True,choices=['writing','truth','continuity'])
p.add_argument('--sources',nargs='*',default=[]); p.add_argument('--report-dir',default='audit')
p.add_argument('--root',default=None,help="the project root (default: the register found upward from the working directory, resolved through its setting project-root)")
p.add_argument('--copy',action='append',default=[],metavar='REPO=COPY',help="the copy to read for a repository whose twins differ: commons (the pair's copy), main or working-tree")
p.add_argument('--referent',default=None,metavar='FOLDER',help="the document's folder referent (truth, continuity): its listing, by list-referent.mjs, written to <report-dir>/sources/referent-<last segment>.txt and given to every reader as a source")
a=p.parse_args()
REGISTER=find_register()
root=os.path.abspath(a.root) if a.root else find_root(REGISTER)
if not root: print('DISPATCH FAIL: no project root found; pass --root'); sys.exit(1)
TWINS=read_twins(REGISTER)
REPO_TWINS=[(d,c) for d,c in TWINS if is_top(os.path.join(root,d)) and is_top(os.path.join(root,c))]
STANDING=[c for d,c in TWINS if (d,c) not in REPO_TWINS and not os.path.isdir(os.path.join(root,c))]
doc=os.path.abspath(a.doc) if os.path.isabs(a.doc) or os.path.isfile(a.doc) else os.path.join(root,a.doc)
if not os.path.isfile(doc): print('DISPATCH FAIL: document does not exist: '+doc); sys.exit(1)
chosen={}
for c in a.copy:
    if '=' not in c or c.split('=',1)[1] not in CHOICES: print(f'DISPATCH FAIL: --copy takes <repo>=<commons|main|working-tree>, got {c}'); sys.exit(1)
    k,v=c.split('=',1); chosen[k]=v
if a.referent is not None and a.kind=='writing': print('DISPATCH FAIL: --referent takes a truth or continuity audit'); sys.exit(1)
brief=open(os.path.join(SKILL,'texts','reader-brief.md'),encoding='utf-8').read().strip()
qs=[l for l in open(os.path.join(SKILL,'texts',f'questions-{a.kind}.md'),encoding='utf-8').read().split('\n') if re.match(r'^\d\. ',l)]
if a.referent is None: qs=[q for q in qs if not re.sub(r'^\d\. ','',q).startswith('Omission')]  # the Omission question reads the referent listing; none without --referent
sources=list(a.sources)
for c in STANDING:
    if a.kind=='truth' and c not in ' '.join(sources): sources.append(c)

versions=[]; read_paths=[]; questions={}
if a.kind!='writing':
    for s in sources:
        rel,absp=relpath(s,root)
        t=twin(rel,root) if not os.path.isabs(rel) else None
        if t is None:
            if not os.path.isfile(absp): print('DISPATCH FAIL: source does not exist: '+absp); sys.exit(1)
            versions.append(version_untwinned(rel,absp,root)); read_paths.append(absp); continue
        repo,tdoc,tcopy,rest=t
        cp,equal,short1=copies(repo,tdoc,tcopy,rest,root)
        if equal:
            versions.append(f'{tcopy}/{rest}@{short1}, commons and seated clone both at {short1}'); read_paths.append(cp['commons'][1]); continue
        if repo not in chosen:
            questions[repo]=cp; versions.append(f'{rel} — the copies differ, see COPY QUESTION {repo}'); read_paths.append(None); continue
        line,path,commit=cp[chosen[repo]]
        if chosen[repo]=='main':
            content=subprocess.run(['git','show',f'main:{rest}'],cwd=os.path.join(root,tdoc),capture_output=True,text=True)
            if content.returncode: print(f'DISPATCH FAIL: {repo} has no main:{rest}'); sys.exit(1)
            os.makedirs(os.path.join(a.report_dir,'sources'),exist_ok=True)
            path=os.path.join(a.report_dir,'sources',f'{repo}-main-{git(["rev-parse","--short","main"],os.path.join(root,tdoc))}-{os.path.basename(rest)}')
            with open(path,'w',encoding='utf-8') as f: f.write(content.stdout)
            path=os.path.abspath(path)
        versions.append(line); read_paths.append(path)
    if a.referent is not None:
        ref=os.path.abspath(a.referent if os.path.isabs(a.referent) or os.path.isdir(a.referent) else os.path.join(root,a.referent))
        if not os.path.isdir(ref): print('DISPATCH FAIL: referent is not a folder: '+ref); sys.exit(1)
        os.makedirs(os.path.join(a.report_dir,'sources'),exist_ok=True)
        listing=os.path.abspath(os.path.join(a.report_dir,'sources',f'referent-{os.path.basename(ref)}.txt'))
        r=subprocess.run(['node',os.path.join(HERE,'list-referent.mjs'),ref,'--out',listing],capture_output=True,text=True)
        if r.returncode: print('DISPATCH FAIL: list-referent.mjs: '+(r.stderr.strip() or f'exit {r.returncode}')); sys.exit(1)
        with open(listing,'rb') as f: digest=hashlib.sha256(f.read()).hexdigest()[:12]
        versions.append(f'referent {relpath(ref,root)[0]} listing sha256 {digest}'); read_paths.append(listing)
    for v in versions: print('VERSION: '+v)
    if questions:
        for repo,cp in questions.items():
            print(f'COPY QUESTION: {repo}')
            for k in CHOICES: print(f'  {k} {cp[k][0]}')
        print('--- 0 prompts: the copies differ; re-run with --copy <repo>=<commons|main|working-tree> for each repository above ---'); sys.exit(2)
    # one read path per distinct file, in order; a source and its twin resolving to one file are read once
    seen=[]; vlines=[]
    for v,rp in zip(versions,read_paths):
        if rp not in seen: seen.append(rp); vlines.append(v)
    read_paths, versions = seen, vlines

for i,q in enumerate(qs,1):
    text=brief.replace('<document>',doc).replace('<question>',re.sub(r'^\d\. ','',q)).replace('<report path>',os.path.join(a.report_dir,f'q{i}.md'))
    if a.kind=='writing': text=re.sub(r' \[truth, continuity: [^\]]*\]','',text)
    else: text=re.sub(r'\[truth, continuity: ([^\]]*)\]',r'\1',text).replace('<sources>',', '.join(read_paths)).replace('<versions>','; '.join(versions))
    print(f'--- prompt {i} ---'); print(text)
print(f'--- {len(qs)} prompts, nothing dispatched ---')
