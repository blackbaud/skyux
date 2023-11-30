import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyHelpInlineAriaExpanded',
})
export class SkyHelpInlineAriaExpandedPipe implements PipeTransform {
  public transform(
    ariaExpanded: boolean | undefined,
    ariaControls: string | undefined
  ): boolean | null {
    return ariaControls ? !!ariaExpanded : null;
  }
}
