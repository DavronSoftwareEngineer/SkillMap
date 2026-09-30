import { render, screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { StoreProvider } from '../store';
import { loadCourseModules } from '../data/courses';
import { Dashboard } from './Dashboard';

it('100% self-checked tasks never imply a verified skill or a prefilled learner result',async()=>{
  const modules=await loadCourseModules('english');
  window.history.replaceState(null,'','#english/dash');
  localStorage.setItem('english_progress',JSON.stringify(Object.fromEntries(modules.flatMap(m=>m.tasks.map(t=>[t.id,true])))));
  render(<StoreProvider><Dashboard onGo={()=>{}}/></StoreProvider>);
  await waitFor(()=>expect(screen.getByText('Topshiriqlar belgilangan')).toBeInTheDocument());
  expect(screen.queryByText('Tayyor',{exact:true})).not.toBeInTheDocument();
  expect(screen.getByText(/Bu foiz o'zingiz belgilagan/)).toBeInTheDocument();
  expect(screen.getByText(/Reviewer bahosi hali to‘liq/)).toBeInTheDocument();
  expect(screen.queryByText(/Qayd etilgan o‘zgarish:/)).not.toBeInTheDocument();
  window.history.replaceState(null,'','#webgis');
});
