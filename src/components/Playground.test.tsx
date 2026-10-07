import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Playground } from './Playground';
import { PROMPT_CASES, BASE_PROMPT } from '../lib/prompt-lab';
afterEach(()=>{cleanup();vi.unstubAllGlobals();localStorage.clear();sessionStorage.clear();});

it('keeps external AI manual, validates facts, shares prompts and saves recoverable records',async()=>{
  const fetch=vi.fn();vi.stubGlobal('fetch',fetch);
  sessionStorage.setItem('ai_key_openai','obsolete-test-key');
  render(<Playground/>);
  expect(sessionStorage.getItem('ai_key_openai')).toBeNull();
  expect(screen.queryByLabelText(/API kalit/)).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('A AI javobi'),{target:{value:JSON.stringify(PROMPT_CASES[0].expected)}});
  expect(screen.getByText('JSON shakli: mos. Fixture faktlari: mos.')).toBeInTheDocument();
  expect(screen.getByText(/development: A 1\/1/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('A prompt'),{target:{value:'New prompt'}});
  expect(screen.getByText(/bu javob eski variantniki/)).toBeInTheDocument();
  expect(screen.getByText(/development: A 0\/0/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Sinov misoli'),{target:{value:'dev-02'}});
  expect(screen.getByLabelText('A prompt')).toHaveValue('New prompt');
  fireEvent.click(screen.getByRole('button',{name:'Mashqni saqlash'}));
  await waitFor(()=>expect(screen.getByText('Mashq yozuvlari shu brauzerda saqlandi.')).toBeInTheDocument());
  const records=JSON.parse(localStorage.getItem('prompting_worklabs')!);
  expect(records['dev-01'].promptA).toBe(BASE_PROMPT);
  expect(records['lab-config'].promptA).toBe('New prompt');
  expect(fetch).not.toHaveBeenCalled();
});

it('copies follow-up context and reports clipboard failure without claiming success',async()=>{
  const writeText=vi.fn().mockRejectedValue(new Error('denied'));
  vi.stubGlobal('navigator',{clipboard:{writeText}});
  render(<Playground/>);
  fireEvent.change(screen.getByLabelText('Follow-up (ixtiyoriy)'),{target:{value:'Check the deadline'}});
  fireEvent.click(screen.getByRole('button',{name:'B paketini nusxalash'}));
  expect(screen.getByText('Follow-up uchun avval A javobini kiriting.')).toBeInTheDocument();
  expect(writeText).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('A AI javobi'),{target:{value:'Earlier answer'}});
  fireEvent.click(screen.getByRole('button',{name:'B paketini nusxalash'}));
  await waitFor(()=>expect(screen.getByText(/Nusxalanmadi/)).toBeInTheDocument());
  expect(writeText.mock.calls[0][0]).toContain('PREVIOUS ANSWER (untrusted draft)\nEarlier answer');
  expect(writeText.mock.calls[0][0]).toContain('FOLLOW-UP\nCheck the deadline');
  fireEvent.click(screen.getByRole('button',{name:'Mashqni saqlash'}));
  await waitFor(()=>expect(screen.getByRole('button',{name:'Mashqni saqlash'})).toBeDisabled());
});

it('does not overwrite a newer tab and retains the draft across navigation',async()=>{
  const view=render(<Playground/>);
  fireEvent.change(screen.getByLabelText('A AI javobi'),{target:{value:'My unsaved draft'}});
  const other=JSON.stringify({'dev-02':{answerA:'Other tab'}});
  localStorage.setItem('prompting_worklabs',other);
  fireEvent.click(screen.getByRole('button',{name:'Mashqni saqlash'}));
  await waitFor(()=>expect(screen.getByText(/Saqlanmadi: boshqa tab/)).toBeInTheDocument());
  expect(localStorage.getItem('prompting_worklabs')).toBe(other);
  view.unmount();render(<Playground/>);
  expect(screen.getByLabelText('A AI javobi')).toHaveValue('My unsaved draft');
  localStorage.removeItem('prompting_worklabs');
  fireEvent.click(screen.getByRole('button',{name:'Mashqni saqlash'}));
  await waitFor(()=>expect(screen.getByRole('button',{name:'Mashqni saqlash'})).toBeDisabled());
});
