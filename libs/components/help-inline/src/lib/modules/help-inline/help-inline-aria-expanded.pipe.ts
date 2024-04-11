import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyHelpInlineAriaExpanded',
  standalone: true,
})
export class SkyHelpInlineAriaExpandedPipe implements PipeTransform {
  public transform(
    ariaExpanded: boolean | undefined,
    ariaControls: string | undefined,
    isPopoverOpened: boolean | undefined,
  ): boolean | null {
    return isPopoverOpened ?? (ariaControls ? !!ariaExpanded : null);
  }
}
