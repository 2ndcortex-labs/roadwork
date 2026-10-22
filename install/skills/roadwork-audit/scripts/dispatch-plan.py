#!/usr/bin/env python3
"""dispatch-plan.py — prints the five reader prompts for one document and one kind. Dispatches nothing: the session agent sends each prompt through the harness's Agent tool.

Before the prompts (truth, continuity) it prints one VERSION line per source — `<path>@<commit>` — and, for a twinned path (a commons copy under nethub/reference/repos/<repo>/ beside a seated clone <root>/<repo>/, or the other way), compares the three copies: the commons' HEAD, the clone's local `main`, the clone's working tree. Equal and unmodified: one line, the commons copy read. Differing: a COPY QUESTION per repository and exit 2, nothing dispatched, until `--copy <repo>=<commons|main|working-tree>` names the copy. Writing prints no VERSION line. Reads git; fetches nothing; writes only the extracted `main` copy under <report-dir>/sources/ when that copy is chosen.
"""
import sys, os, argparse, re, subprocess
HERE=os.path.dirname(os.path.abspath(__file__)); SKILL=os.path.dirname(HERE)
CONST='nethub/reference/repos/buzz-agentic-architecture/docs/constitution.md'
COMMONS='nethub/reference/repos'
CHOICES=('commons','main','working-tree')

def git(args, cwd):
    r=subprocess.run(['git']+args, cwd=cwd, capture_output=True, text=True)
    return r.stdout.strip() if r.returncode==0 else None

def find_root():
    d=SKILL
    while True:
        if os.path.basename(d)=='nethub': return os.path.dirname(d)
        parent=os.path.dirname(d)
        if parent==d: break
        d=parent
    d=os.getcwd()
    while True:
        if os.path.isfile(os.path.join(d,'nethub','CLAUDE.md')): return d
        parent=os.path.dirname(d)
        if parent==d: return None
        d=parent

def is_repo(path): return os.path.isdir(path) and git(['rev-parse','--show-toplevel'],path) is not None

def twin(rel, root):
    """For a path under a commons copy whose repository has a seated clone, or under a seated clone whose repository has a commons copy: (repo, rest). Else None."""
    parts=rel.split('/')
    if rel.startswith(COMMONS+'/') and len(parts)>4:
        repo, rest = parts[3], '/'.join(parts[4:])
        if is_repo(os.path.join(root,repo)) and is_repo(os.path.join(root,COMMONS,repo)): return repo, rest
    elif len(parts)>1 and parts[0]!='nethub':
        repo, rest = parts[0], '/'.join(parts[1:])
        if is_repo(os.path.join(root,repo)) and is_repo(os.path.join(root,COMMONS,repo)): return repo, rest
    return None

def copies(repo, rest, root):
    """The three copies of a twinned path: (label, version line, path to read or None, full commit)."""
    commons_dir=os.path.join(root,COMMONS,repo); clone=os.path.join(root,repo)
    c1=git(['rev-parse','HEAD'],commons_dir) or ''
    c2=git(['rev-parse','main'],clone) or ''
    c3=git(['rev-parse','HEAD'],clone) or ''
    branch=git(['rev-parse','--abbrev-ref','HEAD'],clone) or 'HEAD'
    modified=bool(git(['status','--porcelain','--',rest],clone))
    def short(c):
        if not c: return 'none'
        return git(['rev-parse','--short',c],clone) or git(['rev-parse','--short',c],commons_dir) or c[:7]
    crel=f'{COMMONS}/{repo}/{rest}'; wrel=f'{repo}/{rest}'
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
p.add_argument('--root',default=None,help='the workspace root, the folder holding nethub/ (default: found upward from the skill)')
p.add_argument('--copy',action='append',default=[],metavar='REPO=COPY',help='the copy to read for a repository whose commons copy and seated clone differ: commons, main or working-tree')
a=p.parse_args()
root=os.path.abspath(a.root) if a.root else find_root()
if not root: print('DISPATCH FAIL: no workspace root found; pass --root'); sys.exit(1)
doc=os.path.abspath(a.doc) if os.path.isabs(a.doc) or os.path.isfile(a.doc) else os.path.join(root,a.doc)
if not os.path.isfile(doc): print('DISPATCH FAIL: document does not exist: '+doc); sys.exit(1)
chosen={}
for c in a.copy:
    if '=' not in c or c.split('=',1)[1] not in CHOICES: print(f'DISPATCH FAIL: --copy takes <repo>=<commons|main|working-tree>, got {c}'); sys.exit(1)
    k,v=c.split('=',1); chosen[k]=v
brief=open(os.path.join(SKILL,'texts','reader-brief.md'),encoding='utf-8').read().strip()
qs=[l for l in open(os.path.join(SKILL,'texts',f'questions-{a.kind}.md'),encoding='utf-8').read().split('\n') if re.match(r'^\d\. ',l)]
sources=list(a.sources)
if a.kind=='truth' and CONST not in ' '.join(sources): sources.append(CONST)

versions=[]; read_paths=[]; questions={}
if a.kind!='writing':
    for s in sources:
        rel,absp=relpath(s,root)
        t=twin(rel,root) if not os.path.isabs(rel) else None
        if t is None:
            if not os.path.isfile(absp): print('DISPATCH FAIL: source does not exist: '+absp); sys.exit(1)
            versions.append(version_untwinned(rel,absp,root)); read_paths.append(absp); continue
        repo,rest=t
        cp,equal,short1=copies(repo,rest,root)
        if equal:
            versions.append(f'{COMMONS}/{repo}/{rest}@{short1}, commons and seated clone both at {short1}'); read_paths.append(cp['commons'][1]); continue
        if repo not in chosen:
            questions[repo]=cp; versions.append(f'{rel} — the copies differ, see COPY QUESTION {repo}'); read_paths.append(None); continue
        line,path,commit=cp[chosen[repo]]
        if chosen[repo]=='main':
            content=subprocess.run(['git','show',f'main:{rest}'],cwd=os.path.join(root,repo),capture_output=True,text=True)
            if content.returncode: print(f'DISPATCH FAIL: {repo} has no main:{rest}'); sys.exit(1)
            os.makedirs(os.path.join(a.report_dir,'sources'),exist_ok=True)
            path=os.path.join(a.report_dir,'sources',f'{repo}-main-{git(["rev-parse","--short","main"],os.path.join(root,repo))}-{os.path.basename(rest)}')
            with open(path,'w',encoding='utf-8') as f: f.write(content.stdout)
            path=os.path.abspath(path)
        versions.append(line); read_paths.append(path)
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
