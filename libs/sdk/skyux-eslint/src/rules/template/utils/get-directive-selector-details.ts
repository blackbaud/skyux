import { DeprecatedDirective } from './types';

interface DirectiveSelectorDetail {
  elementName?: string;
  parent: DeprecatedDirective;
  templateBindingName: string;
}

/**
 * Given a directive selector (e.g. `input[skyInputBox],textarea[skyInputBox]`),
 * returns the element/attribute pairs.
 */
export function getDirectiveSelectorDetails(
  directives: DeprecatedDirective[],
): DirectiveSelectorDetail[] {
  const details: DirectiveSelectorDetail[] = [];

  for (const directive of directives) {
    const pieces = directive.selector
      .split(',')
      .map((fragment) => fragment.trim());

    for (const piece of pieces) {
      const elementName = piece.split('[')[0];

      details.push({
        parent: directive,
        elementName,
        templateBindingName: piece.split('[')[1].split(']')[0],
      });
    }
  }

  return details;
}
