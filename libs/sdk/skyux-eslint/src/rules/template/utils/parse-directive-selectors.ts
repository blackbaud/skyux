import { type SkyManifestDeprecatedDirective } from '@skyux/manifest';

interface DirectiveSelectorDetail {
  directive: SkyManifestDeprecatedDirective;
  attr: string;
  element?: string;
}

/**
 * Given a directive selector (e.g. input[skyInputBox], textarea[skyInputBox]),
 * returns the element/attribute pairs.
 */
export function parseDirectiveSelectors(
  directives: SkyManifestDeprecatedDirective[],
): DirectiveSelectorDetail[] {
  const details: DirectiveSelectorDetail[] = [];

  for (const directive of directives) {
    const pieces = directive.selector.split(',').map((p) => p.trim());

    for (const piece of pieces) {
      const element = piece.split('[')[0];

      details.push({
        directive,
        element,
        attr: piece.split('[')[1].split(']')[0],
      });
    }
  }

  return details;
}
