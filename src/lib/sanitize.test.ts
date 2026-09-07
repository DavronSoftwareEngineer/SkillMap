import { expect, it } from 'vitest';
import { sanitizeCourseHtml } from './sanitize';
it('removes executable HTML and SVG URL/animation paths', () => {
  const clean = sanitizeCourseHtml('<script>alert(1)</script><svg><a xlink:href="java&#10;script:alert(1)">x</a><animate attributeName="href" values="javascript:alert(1)"/><foreignObject><iframe srcdoc="x"></iframe></foreignObject><path d="M0 0L1 1"/></svg><img src="javascript:alert(1)" onerror="alert(1)" srcset="evil 1x">');
  expect(clean).not.toMatch(/javascript|xlink:href|onerror|srcset|animate|foreignObject|iframe|<script/i);
  expect(clean).toContain('<path');
});
it('preserves course markup and safe links, isolates external tabs', () => {
  const clean = sanitizeCourseHtml('<h3>Lesson</h3><a href="#russian/%D0%90" target="_blank">Link</a><a href="https://example.com">Docs</a>');
  expect(clean).toContain('<h3>Lesson</h3>');
  expect(clean).toContain('noopener noreferrer');
  expect(clean).toContain('https://example.com');
});
