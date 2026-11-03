import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const MARKDOWN_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'br', 'strong', 'em', 'blockquote', 'ul', 'ol', 'li',
  'a', 'hr', 'code', 'pre',
];

export function renderSafeMarkdown(markdown: string) {
  const html = marked.parse(markdown, { async: false, breaks: true });
  if (typeof html !== 'string') throw new Error('Could not render devotional text.');

  return sanitizeHtml(html, {
    allowedTags: MARKDOWN_TAGS,
    allowedAttributes: { a: ['href', 'name', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
}
