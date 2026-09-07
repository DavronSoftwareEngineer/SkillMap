import { it,expect } from 'vitest';
import { render,screen,fireEvent } from '@testing-library/react';
import { ModuleWorkshop } from './ModuleWorkshop';
import { MODULE_WORKSHOPS } from '../data/learning/module-workshops';
it('shows module-specific input before revealing reasoning and retains the independent task',()=>{
  const item=MODULE_WORKSHOPS.frontend.FE7;
  render(<ModuleWorkshop item={item}/>);
  expect(screen.getByText(item.input)).toBeVisible();
  expect(screen.getByText(item.answer)).not.toBeVisible();
  fireEvent.click(screen.getByText('Yechim va sababini ko‘rish'));
  expect(screen.getByText(item.answer)).toBeVisible();
  expect(screen.getByText(item.variation)).toBeVisible();
  expect(screen.getByText(item.acceptance)).toBeVisible();
});
