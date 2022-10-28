import { Pipe, PipeTransform } from '@angular/core';

import { SkyProgressIndicatorNavButtonType } from '../types/progress-indicator-nav-button-type';

@Pipe({
  name: 'skyProgressIndicatorNavButtonDisabled',
})
export class SkyProgressIndicatorNavButtonDisabledPipe
  implements PipeTransform
{
  public transform(
    disabled: boolean | undefined,
    buttonType: SkyProgressIndicatorNavButtonType,
    activeIndex: number | undefined,
    itemStatuses: string[] | undefined
  ): boolean | undefined {
    const isLastStep = itemStatuses && activeIndex === itemStatuses.length - 1;

    return (
      (buttonType === 'next' && isLastStep) ||
      (buttonType === 'previous' && activeIndex === 0) ||
      disabled
    );
  }
}
