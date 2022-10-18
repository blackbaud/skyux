import { Pipe, PipeTransform } from '@angular/core';

import { SkyTabComponent } from './tab.component';
import { SkyTabsetNavButtonType } from './tabset-nav-button-type';

@Pipe({
  name: 'skyTabsetNavButtonDisabled',
})
export class SkyTabsetNavButtonDisabledPipe implements PipeTransform {
  public transform(
    disabled: boolean | undefined,
    buttonType?: SkyTabsetNavButtonType | string,
    tabToSelect?: SkyTabComponent
  ): boolean {
    if (disabled !== undefined) {
      return disabled;
    } else if (buttonType === 'finish') {
      return false;
    }

    return tabToSelect === undefined || !!tabToSelect.disabled;
  }
}
