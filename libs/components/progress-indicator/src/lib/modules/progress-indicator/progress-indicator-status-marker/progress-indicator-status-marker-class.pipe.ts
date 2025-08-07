import { Pipe, PipeTransform } from '@angular/core';

import { SkyProgressIndicatorItemStatus } from '../types/progress-indicator-item-status';

@Pipe({
  name: 'skyProgressIndicatorMarkerClass',
  standalone: false,
})
export class SkyProgressIndicatorMarkerClassPipe implements PipeTransform {
  public transform(
    displayMode: string,
    status: SkyProgressIndicatorItemStatus,
  ): string {
    let statusName: string;

    switch (status) {
      case SkyProgressIndicatorItemStatus.Complete:
        statusName = 'complete';
        break;
      case SkyProgressIndicatorItemStatus.Incomplete:
        statusName = 'incomplete';
        break;
      case SkyProgressIndicatorItemStatus.Pending:
        statusName = 'pending';
        break;
      default:
        statusName = 'active';
    }

    return `sky-progress-indicator-status-marker-mode-${displayMode} sky-progress-indicator-status-marker-status-${statusName}`;
  }
}
