const SPRITE_SELECTOR = 'svg#sky-icon-svg-sprite';
const HREF_ATTRIBUTE = /^(xlink:)?href$/;
const URL_REFERENCE = /url\(\s*['"]?#([^'")\s]+)/g;

/**
 * Removes the symbols in the SKY UX icon sprite that nothing else in the
 * document references, including symbols referenced only by other removed
 * symbols. The sprite contains every SKY UX icon (about 1.8 MB) and is inserted
 * at the start of `<body>`, so it otherwise makes up nearly all of a Percy DOM
 * snapshot. Pass this as Percy's `domTransformation` so that only the copy of
 * the DOM that Percy renders is changed.
 */
export function pruneIconSprite(documentElement: Element): void {
  const sprites = Array.from(documentElement.querySelectorAll(SPRITE_SELECTOR));

  if (sprites.length === 0) {
    return;
  }

  // Map every ID in the sprites to the sprite child that contains it, so a
  // reference to a gradient keeps the symbol that defines it.
  const ownerById = new Map<string, Element>();

  for (const sprite of sprites) {
    for (const child of Array.from(sprite.children)) {
      for (const element of [child, ...child.querySelectorAll('[id]')]) {
        ownerById.set(element.id, child);
      }
    }
  }

  const kept = new Set<Element>();

  const keep = (ids: Iterable<string>): void => {
    for (const id of ids) {
      const owner = ownerById.get(id);

      if (owner && !kept.has(owner)) {
        kept.add(owner);
        keep(getReferencedIds([owner, ...owner.querySelectorAll('*')]));
      }
    }
  };

  keep(getReferencedIds(getElementsOutside(documentElement, sprites)));

  for (const sprite of sprites) {
    for (const child of Array.from(sprite.children)) {
      if (child.localName === 'symbol' && !kept.has(child)) {
        child.remove();
      }
    }
  }
}

function getElementsOutside(root: Element, excluded: Element[]): Element[] {
  const elements: Element[] = [];
  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    (node) =>
      excluded.includes(node as Element)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  );

  while (walker.nextNode()) {
    elements.push(walker.currentNode as Element);
  }

  return elements;
}

function* getReferencedIds(elements: Iterable<Element>): Generator<string> {
  for (const element of elements) {
    for (const { name, value } of Array.from(element.attributes)) {
      if (HREF_ATTRIBUTE.test(name) && value.startsWith('#')) {
        yield value.substring(1);
      }

      yield* getUrlReferences(value);
    }

    if (element.localName === 'style') {
      yield* getUrlReferences(element.innerHTML);
    }
  }
}

function* getUrlReferences(text: string): Generator<string> {
  for (const match of text.matchAll(URL_REFERENCE)) {
    yield match[1];
  }
}
