/**
 * Gives every h2 in an article's HTML an id and returns the list, so the
 * contents sidebar can be built from the article itself. Existing ids are kept.
 */
export type PostHeading = { id: string; text: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&[a-z]+;|[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Sidebar labels: "1. Switch to carryout, when…" stays readable without markup. */
const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .trim();

export function withHeadingIds(html: string): { html: string; headings: PostHeading[] } {
  const headings: PostHeading[] = [];
  const seen = new Set<string>();
  const out = html.replace(/<h2( id="([^"]+)")?([^>]*)>(.*?)<\/h2>/g, (_m, _idAttr, existing, rest, inner) => {
    const text = plain(inner);
    let id = existing || slugify(text);
    while (seen.has(id)) id += '-2';
    seen.add(id);
    headings.push({ id, text });
    return `<h2 id="${id}"${rest}>${inner}</h2>`;
  });
  return { html: out, headings };
}
