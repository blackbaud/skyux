import { Pipe, PipeTransform } from '@angular/core';
import { SkyMediaBreakpointType } from '@skyux/core';

import { SkySummaryActionBarType } from './types/summary-action-bar-type';

@Pipe({
  name: 'skySummaryActionBarCollapsible',
})
export class SkySummaryActionBarCollapsiblePipe implements PipeTransform {
  public transform(
    summaryActionBarType: SkySummaryActionBarType | undefined,
    mediaBreakpoint: SkyMediaBreakpointType | null,
  ): boolean {
    return (
      summaryActionBarType === SkySummaryActionBarType.StandardModal ||
      mediaBreakpoint === 'xs'
    );
  }
}
