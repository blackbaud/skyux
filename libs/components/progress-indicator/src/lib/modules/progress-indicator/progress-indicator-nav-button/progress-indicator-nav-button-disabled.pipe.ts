import { Pipe, PipeTransform } from '@angular/core';

import { SkyProgressIndicatorItemStatus } from '../types/progress-indicator-item-status';
import { SkyProgressIndicatorNavButtonType } from '../types/progress-indicator-nav-button-type';

@Pipe({
  name: 'skyProgressIndicatorNavButtonDisabled',
  standalone: false,
})
export class SkyProgressIndicatorNavButtonDisabledPipe
  implements PipeTransform
{
  public transform(
    disabled: boolean | undefined,
    buttonType: SkyProgressIndicatorNavButtonType,
    activeIndex: number | undefined,
    itemStatuses: SkyProgressIndicatorItemStatus[] | undefined,
  ): boolean | undefined {
    const isLastStep = itemStatuses && activeIndex === itemStatuses.length - 1;

    return (
      (buttonType === 'next' && isLastStep) ||
      (buttonType === 'previous' && activeIndex === 0) ||
      disabled
    );
  }
}
