import type { DeprecatedDirective } from '../types/deprecation';

interface DirectiveSelectorDetail {
  directive: DeprecatedDirective;
  attr: string;
  element?: string;
}

/**
 * Given a directive selector (e.g. input[skyInputBox], textarea[skyInputBox]),
 * returns the element/attribute pairs.
 */
export function parseDirectiveSelectors(
  directives: Record<string, DeprecatedDirective>,
): DirectiveSelectorDetail[] {
  const details: DirectiveSelectorDetail[] = [];

  const selectors = Object.keys(directives);

  for (const selector of selectors) {
    const pieces = selector.split(',').map((p) => p.trim());

    for (const piece of pieces) {
      const element = piece.split('[')[0];

      details.push({
        directive: directives[selector],
        element,
        attr: piece.split('[')[1].split(']')[0],
      });
    }
  }

  return details;
}
