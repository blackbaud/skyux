import { Pipe, PipeTransform } from '@angular/core';

import { SkyTabsetNavButtonType } from './tabset-nav-button-type';

@Pipe({
  name: 'skyTabsetNavButtonDisabled',
  standalone: false,
})
export class SkyTabsetNavButtonDisabledPipe implements PipeTransform {
  public transform(
    disabled: boolean | undefined,
    buttonType?: SkyTabsetNavButtonType | string,
    tabToSelectExists?: boolean,
    tabToSelectIsDisabled?: boolean,
  ): boolean {
    if (disabled !== undefined) {
      return disabled;
    } else if (buttonType === 'finish') {
      return false;
    }

    return !tabToSelectExists || !!tabToSelectIsDisabled;
  }
}
