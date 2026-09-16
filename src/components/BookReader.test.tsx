import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BookReader } from './BookReader';

it('offers safe top-level book links without CSP-blocked scripts or iframes', () => {
  const {container}=render(<BookReader book={{n:1,title:'Eloquent JavaScript',author:'Author',isbn:'9781593279509',accent:'#fff',note:'Read'}} onBack={()=>{}} />);
  const official=screen.getByRole('link',{name:/Rasmiy manbada ochish/});
  expect(official).toHaveAttribute('href','https://eloquentjavascript.net/');
  expect(official).toHaveAttribute('rel','noopener noreferrer');
  expect(official).toHaveAttribute('target','_blank');
  fireEvent.click(screen.getByRole('tab',{name:'Google Preview'}));
  expect(screen.getByRole('link',{name:/Google Books’da/})).toHaveAttribute('href','https://books.google.com/books?vid=ISBN9781593279509');
  expect(container.querySelector('iframe')).toBeNull();
  expect(document.querySelector('script[data-google-books-api]')).toBeNull();
});
