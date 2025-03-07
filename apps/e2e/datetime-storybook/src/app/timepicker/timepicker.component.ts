import { Component, Input } from '@angular/core';
import { SkyTimepickerTimeOutput } from '@skyux/datetime';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  standalone: false,
})
export class TimepickerComponent {
  @Input()
  public timeFormat: 'hh' | 'HH' = 'hh';

  public time: SkyTimepickerTimeOutput = {
    hour: 0,
    minute: 30,
    timezone: -4,
    meridie: 'AM',
    customFormat: 'h:mm A',
    local: '12:30 AM',
    iso8601: new Date(
      'Mon Jul 31 2023 00:30:00 GMT-0400 (Eastern Daylight Time)',
    ),
  };
}
