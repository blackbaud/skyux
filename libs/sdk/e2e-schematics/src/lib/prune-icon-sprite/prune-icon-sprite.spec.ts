/**
 * @jest-environment jsdom
 */
import { pruneIconSprite } from './prune-icon-sprite';

const SPRITE = `
  <svg id="sky-icon-svg-sprite" hidden="true">
    <symbol id="sky-i-a"><path d="M0 0"></path></symbol>
    <symbol id="sky-i-b">
      <defs><linearGradient id="sky-i-b-gradient"></linearGradient></defs>
      <path fill="url(#sky-i-b-gradient)"></path>
    </symbol>
    <symbol id="sky-i-c"><path d="M0 0"></path></symbol>
    <symbol id="sky-i-d"><use href="#sky-i-c"></use></symbol>
  </svg>
`;

function createDocumentElement(body: string): HTMLElement {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = body;
  return doc.documentElement;
}

function getSymbolIds(documentElement: HTMLElement): string[] {
  return Array.from(
    documentElement.querySelectorAll('#sky-icon-svg-sprite > symbol'),
  ).map((symbol) => symbol.id);
}

describe('pruneIconSprite', () => {
  it('should keep only the symbols referenced by a use element', () => {
    const documentElement = createDocumentElement(`
      ${SPRITE}
      <svg><use xlink:href="#sky-i-a"></use></svg>
      <svg><use href="#sky-i-b"></use></svg>
    `);

    pruneIconSprite(documentElement);

    expect(getSymbolIds(documentElement)).toEqual(['sky-i-a', 'sky-i-b']);
  });

  it('should keep the gradients inside a kept symbol', () => {
    const documentElement = createDocumentElement(`
      ${SPRITE}
      <svg><use href="#sky-i-b"></use></svg>
    `);

    pruneIconSprite(documentElement);

    expect(
      documentElement.querySelector('#sky-i-b-gradient')?.parentElement
        ?.localName,
    ).toBe('defs');
  });

  it('should keep the symbols that a kept symbol references', () => {
    const documentElement = createDocumentElement(`
      ${SPRITE}
      <svg><use href="#sky-i-d"></use></svg>
    `);

    pruneIconSprite(documentElement);

    expect(getSymbolIds(documentElement)).toEqual(['sky-i-c', 'sky-i-d']);
  });

  it('should keep the symbols referenced with url() in attributes and styles', () => {
    const documentElement = createDocumentElement(`
      ${SPRITE}
      <style>.masked { mask: url("#sky-i-c"); }</style>
      <svg><rect fill="url(#sky-i-b-gradient)"></rect></svg>
    `);

    pruneIconSprite(documentElement);

    expect(getSymbolIds(documentElement)).toEqual(['sky-i-b', 'sky-i-c']);
  });

  it('should not keep symbols referenced only from another file', () => {
    const documentElement = createDocumentElement(`
      ${SPRITE}
      <svg><use href="other-sprite.svg#sky-i-a"></use></svg>
    `);

    pruneIconSprite(documentElement);

    expect(getSymbolIds(documentElement)).toEqual([]);
  });

  it('should leave a document without the icon sprite unchanged', () => {
    const documentElement = createDocumentElement(`
      <svg id="other-sprite"><symbol id="other-icon"></symbol></svg>
    `);
    const html = documentElement.outerHTML;

    pruneIconSprite(documentElement);

    expect(documentElement.outerHTML).toBe(html);
  });
});
