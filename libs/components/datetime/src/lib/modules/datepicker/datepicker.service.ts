import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDatepickerDate } from './calendar/datepicker-date';

/**
 * Manages the state of the calendar picker.
 * TODO: Consider changing the name of this service to better fit its purpose.
 * @internal
 */
@Injectable()
export class SkyDatepickerService {
  /**
   * Whether a key date popover is currently displayed.
   * Useful for communicating across all daypicker siblings when a popover is displayed.
   */
  public keyDatePopoverStream: Subject<SkyDatepickerDate | undefined> =
    new Subject<SkyDatepickerDate | undefined>();
}
