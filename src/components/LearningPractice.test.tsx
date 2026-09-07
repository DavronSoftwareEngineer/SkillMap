import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LearningPractice } from './LearningPractice';
import { LEARNING_TRACKS } from '../data/learning';

it('lets learners attempt, reveal worked feedback, and revise without recording certification',()=>{
  const item=LEARNING_TRACKS.systemdesign.cases[0];
  render(<LearningPractice cases={[item]} />);
  expect(screen.getByText(item.expected)).not.toBeVisible();
  const details=screen.getByText(item.expected).closest('details')!;
  fireEvent.click(screen.getByText('Bajargandan keyin kutilgan natijani oching'));
  expect(details.open).toBe(true);
  fireEvent.click(screen.getByRole('button',{name:item.check.a[0]}));
  expect(screen.getByRole('status')).toHaveTextContent('Qayta');
  fireEvent.click(screen.getByRole('button',{name:item.check.a[item.check.c]}));
  expect(screen.getByRole('status')).toHaveTextContent("To'g'ri qaror.");
  expect(screen.getByText(item.transfer)).toBeVisible();
});
