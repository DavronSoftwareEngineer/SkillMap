import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Playground } from './Playground';
afterEach(()=>{vi.unstubAllGlobals(); sessionStorage.clear();});
it('cancels a pending request and allows another attempt',async()=>{
  const fetch = vi.fn((_url: string, init: RequestInit) => new Promise((_resolve,reject)=>{
    init.signal!.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')));
  }));
  vi.stubGlobal('fetch',fetch);
  render(<Playground/>);
  fireEvent.change(screen.getByLabelText('Shaxsiy API kalit (BYOK)'),{target:{value:'test-only-key'}});
  fireEvent.change(screen.getByLabelText('Prompt',{exact:true}),{target:{value:'test'}});
  fireEvent.click(screen.getByRole('button',{name:'Yubor ->'}));
  expect(screen.getByRole('button',{name:'OpenAI (GPT)'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button',{name:'So‘rovni bekor qilish'}));
  await waitFor(()=>expect(screen.getByRole('alert')).toHaveTextContent('bekor qilindi'));
  expect(screen.getByRole('button',{name:'Yubor ->'})).toBeEnabled();
  expect(fetch).toHaveBeenCalledTimes(1);
});
it('aborts pending work on unmount',()=>{
  let signal: AbortSignal | null | undefined;
  vi.stubGlobal('fetch',vi.fn((_url,init:RequestInit)=>{signal=init.signal;return new Promise(()=>{});}));
  const view=render(<Playground/>);
  fireEvent.change(screen.getByLabelText('Shaxsiy API kalit (BYOK)'),{target:{value:'test-only-key'}});
  fireEvent.change(screen.getByLabelText('Prompt',{exact:true}),{target:{value:'test'}});
  fireEvent.click(screen.getByRole('button',{name:'Yubor ->'}));
  view.unmount();
  expect(signal?.aborted).toBe(true);
});
