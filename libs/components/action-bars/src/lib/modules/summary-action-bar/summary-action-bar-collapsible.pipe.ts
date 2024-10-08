import { Pipe, PipeTransform } from '@angular/core';
import { SkyMediaBreakpoints } from '@skyux/core';

import { SkySummaryActionBarType } from './types/summary-action-bar-type';

@Pipe({
  name: 'skySummaryActionBarCollapsible',
})
export class SkySummaryActionBarCollapsiblePipe implements PipeTransform {
  public transform(
    summaryActionBarType: SkySummaryActionBarType | undefined,
    mediaBreakpoint: SkyMediaBreakpoints,
  ): boolean {
    console.log(
      'pipe eh?',
      summaryActionBarType,
      SkySummaryActionBarType.StandardModal,
      mediaBreakpoint,
      SkyMediaBreakpoints.xs,
    );
    return (
      summaryActionBarType === SkySummaryActionBarType.StandardModal ||
      mediaBreakpoint === SkyMediaBreakpoints.xs
    );
  }
}
