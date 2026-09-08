import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PracticeNotebook } from './PracticeNotebook';
import { loadCourseModules } from '../data/courses';
import { applyBackup, buildBackup } from '../lib/backup';
afterEach(()=>vi.restoreAllMocks());
it('preserves malformed source and displays healthy sibling records',async()=>{
  const modules=await loadCourseModules('backend');
  const raw=JSON.stringify({[modules[0].zoom]:{attempt:42},[modules[1].zoom]:{attempt:'Keep me'}});
  localStorage.setItem('backend_practice',raw);
  render(<PracticeNotebook courseId="backend" module={modules[1]}/>);
  expect(screen.getByLabelText(/1. Birinchi/)).toHaveValue('Keep me');
  fireEvent.change(screen.getByLabelText(/2. Xato/),{target:{value:'New draft'}});
  expect(localStorage.getItem('backend_practice')).toBe(raw);
  expect(screen.getByRole('status')).toHaveTextContent('manba buzilgan');
});
it('merges a different field from another tab and refuses same-field conflicts',async()=>{
  const [module]=await loadCourseModules('finance');
  localStorage.setItem('finance_practice',JSON.stringify({[module.zoom]:{attempt:'original'}}));
  render(<PracticeNotebook courseId="finance" module={module}/>);
  localStorage.setItem('finance_practice',JSON.stringify({[module.zoom]:{attempt:'new elsewhere'}}));
  fireEvent.change(screen.getByLabelText(/2. Xato/),{target:{value:'correction'}});
  expect(JSON.parse(localStorage.getItem('finance_practice')!)[module.zoom]).toEqual({attempt:'new elsewhere',reason:'correction'});
  localStorage.setItem('finance_practice',JSON.stringify({[module.zoom]:{attempt:'newest elsewhere',reason:'correction'}}));
  fireEvent.change(screen.getByLabelText(/1. Birinchi/),{target:{value:'my conflicting edit'}});
  expect(JSON.parse(localStorage.getItem('finance_practice')!)[module.zoom].attempt).toBe('newest elsewhere');
  expect(screen.getByLabelText(/1. Birinchi/)).toHaveValue('my conflicting edit');
  expect(screen.getByRole('status')).toHaveTextContent('boshqa tab');
});
it('preserves first attempts, independent revisions and other module records through backup',async()=>{
  const modules=await loadCourseModules('frontend');
  const view=render(<PracticeNotebook courseId="frontend" module={modules[0]}/>);
  fireEvent.change(screen.getByLabelText(/1. Birinchi/),{target:{value:'My original reasoning'}});
  fireEvent.change(screen.getByLabelText(/2. Xato/),{target:{value:'A separate correction'}});
  expect(screen.getByLabelText(/1. Birinchi/)).toHaveValue('My original reasoning');
  view.unmount();
  const other=render(<PracticeNotebook courseId="frontend" module={modules[1]}/>);
  fireEvent.change(screen.getByLabelText(/3. Yangi/),{target:{value:'Second module result'}});
  other.unmount();
  const backup=buildBackup(new Date());localStorage.clear();applyBackup(JSON.stringify(backup));
  render(<PracticeNotebook courseId="frontend" module={modules[0]}/>);
  expect(screen.getByLabelText(/2. Xato/)).toHaveValue('A separate correction');
  expect(JSON.parse(localStorage.getItem('frontend_practice')!)[modules[1].zoom].transfer).toBe('Second module result');
});
it('keeps failed-save draft when a learner leaves and returns to the module',async()=>{
  const [module]=await loadCourseModules('git');
  const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota');});
  const view=render(<PracticeNotebook courseId="git" module={module}/>);
  fireEvent.change(screen.getByLabelText(/1. Birinchi/),{target:{value:'Unsaved original'}});
  expect(screen.getByRole('status')).toHaveTextContent('Saqlanmadi');
  view.unmount();spy.mockRestore();
  render(<PracticeNotebook courseId="git" module={module}/>);
  expect(screen.getByLabelText(/1. Birinchi/)).toHaveValue('Unsaved original');
});
it('rejects malformed notebook imports before changing existing progress',()=>{
  localStorage.setItem('frontend_progress','{"old":true}');
  expect(()=>applyBackup(JSON.stringify({app:'SkillMap',version:1,data:{frontend_progress:{new:true},frontend_practice:{FE0:{attempt:42}}}}))).toThrow();
  expect(localStorage.getItem('frontend_progress')).toBe('{"old":true}');
});
