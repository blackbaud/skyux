import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDatepickerDate } from './datepicker-date';

/**
 * @internal
 */
@Injectable()
export class SkyDatepickerService {
  /**
   * If a key date popover is currently displayed.
   * Useful for communicating across all daypicker siblings when a popover is displayed.
   */
  public keyDatePopoverStream: Subject<SkyDatepickerDate | undefined> =
    new Subject<SkyDatepickerDate | undefined>();
}
