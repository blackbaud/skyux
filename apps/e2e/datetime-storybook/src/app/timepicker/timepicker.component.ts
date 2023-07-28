import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent {
  @Input()
  public timeFormat: 'hh' | 'HH' = 'hh';
}
