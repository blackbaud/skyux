import { Component, ViewChild } from '@angular/core';

import { SkyTimepickerTimeFormatType } from '../timepicker-time-format-type';
import { SkyTimepickerTimeOutput } from '../timepicker-time-output';
import { SkyTimepickerComponent } from '../timepicker.component';
import { SkyTimepickerInputDirective } from '../timepicker.directive';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './timepicker-input-box-component.fixture.html',
  standalone: false,
})
export class TimepickerInputBoxTestComponent {
  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent!: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker!: SkyTimepickerInputDirective;

  public labelText = 'Time';

  public returnFormat: string | undefined;

  public selectedTime: SkyTimepickerTimeOutput | undefined;

  public timeFormat: SkyTimepickerTimeFormatType | undefined = 'hh';
}
