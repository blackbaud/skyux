import { Pipe, PipeTransform } from '@angular/core';

import { SkyProgressIndicatorItemStatusType } from '../types/progress-indicator-item-status-type';

@Pipe({
  name: 'skyProgressIndicatorMarkerClass',
})
export class SkyProgressIndicatorMarkerClassPipe implements PipeTransform {
  public transform(
    displayMode: string,
    status: SkyProgressIndicatorItemStatusType
  ): string {
    return `sky-progress-indicator-status-marker-mode-${displayMode} sky-progress-indicator-status-marker-status-${status}`;
  }
}
