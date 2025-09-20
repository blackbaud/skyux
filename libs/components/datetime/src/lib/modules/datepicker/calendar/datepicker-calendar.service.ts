import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDayPickerContext } from './daypicker-context';

/**
 * Manages the state of the calendar picker.
 * @internal
 */
@Injectable()
export class SkyDatepickerCalendarService {
  /**
   * Whether a key date popover is currently displayed.
   * Useful for communicating across all daypicker siblings when a popover is displayed.
   */
  public keyDatePopoverStream: Subject<SkyDayPickerContext | undefined> =
    new Subject<SkyDayPickerContext | undefined>();
}
