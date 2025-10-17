import { Pipe, PipeTransform } from '@angular/core';

/**
 * Sets the value of `aria-label` for inline help buttons.
 * @internal
 */
@Pipe({
  name: 'skyHelpInlineAriaLabel',
})
export class SkyHelpInlineAriaLabelPipe implements PipeTransform {
  public transform(
    ariaLabel: string | undefined,
    labelText: string | undefined,
    labelledBy: string | undefined,
    defaultAriaLabel: string | undefined,
  ): string | undefined {
    if (labelledBy) {
      return;
    }

    if (labelText) {
      return labelText;
    }

    if (ariaLabel) {
      return ariaLabel;
    }

    return defaultAriaLabel;
  }
}
