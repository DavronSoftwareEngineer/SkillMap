// Creates ONLY new temporary repositories. No pushes to GitHub or user's repositories.
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root=mkdtempSync(join(tmpdir(),'skillmap-git-training-'));
const remote=join(root,'remote.git'),a=join(root,'alice'),b=join(root,'bob');
const run=(cwd,...args)=>execFileSync('git',['-c','core.hooksPath=', '-c','commit.gpgsign=false',...args],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe'],windowsHide:true}).trim();
const configure=cwd=>{run(cwd,'config','user.name','Synthetic Learner');run(cwd,'config','user.email','learner@example.invalid');run(cwd,'config','core.autocrlf','false');};
run(root,'init','--bare',remote);run(root,'clone',remote,a);configure(a);
run(a,'checkout','-b','main');
writeFileSync(join(a,'notes.txt'),'A\n');run(a,'add','notes.txt');run(a,'commit','-m','initial fixture');
writeFileSync(join(a,'notes.txt'),'A\nB\n');run(a,'add','notes.txt');writeFileSync(join(a,'notes.txt'),'A\nB\nC\n');
assert.match(run(a,'diff','--cached'),/\+B/);assert.doesNotMatch(run(a,'diff','--cached'),/\+C/);
assert.match(run(a,'diff'),/\+C/);run(a,'commit','-m','stage B only');assert.equal(run(a,'show','HEAD:notes.txt'),'A\nB');
run(a,'add','notes.txt');run(a,'commit','-m','include C');
run(a,'push','-u','origin','main');run(root,'clone','--branch','main',remote,b);configure(b);
writeFileSync(join(a,'notes.txt'),'Map\n');run(a,'add','notes.txt');run(a,'commit','-m','Alice chooses Map');run(a,'push');
writeFileSync(join(b,'notes.txt'),'Atlas\n');run(b,'add','notes.txt');run(b,'commit','-m','Bob chooses Atlas');
run(b,'fetch','origin');
let conflicted=false;try{run(b,'merge','origin/main');}catch{conflicted=true;}
assert.equal(conflicted,true);assert.match(run(b,'status','--porcelain'),/UU notes.txt/);
const stages={base:run(b,'show',':1:notes.txt'),ours:run(b,'show',':2:notes.txt'),theirs:run(b,'show',':3:notes.txt')};
assert.equal(stages.ours,'Atlas');assert.equal(stages.theirs,'Map');
writeFileSync(join(b,'notes.txt'),'Map Atlas\n');run(b,'add','notes.txt');run(b,'commit','-m','Resolve meaning: Map Atlas');
const merged=run(b,'rev-parse','HEAD');assert.equal(run(b,'show','HEAD:notes.txt'),'Map Atlas');
run(b,'branch','rescue',merged);assert.equal(run(b,'rev-parse','rescue'),merged);
run(b,'push');run(a,'pull','--ff-only');assert.equal(run(a,'rev-parse','HEAD'),merged);
const report={synthetic:true,root,checks:['working tree vs index','two clones','real merge conflict','resolved content','rescue ref','same commit in both clones'],stages,merged,graph:run(a,'log','--graph','--oneline','--all')};
writeFileSync(join(root,'evidence.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
console.log('Temporary lab retained for inspection. This script never removes repositories.');
