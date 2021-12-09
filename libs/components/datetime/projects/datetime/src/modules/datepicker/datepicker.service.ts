import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDatepickerDate } from './datepicker-date';

/**
 * @internal
 */
@Injectable()
export class SkyDatepickerService {
  /**
   * Specifies if a key date popover is currently displayed.
   * Useful for communicating across all daypicker siblings when a popover is displayed.
   */
  public keyDatePopoverStream: Subject<SkyDatepickerDate> =
    new Subject<SkyDatepickerDate>();
}
