import { Component, ViewChild } from '@angular/core';

import { SkyTimepickerTimeFormatType } from '../timepicker-time-format-type';
import { SkyTimepickerTimeOutput } from '../timepicker-time-output';
import { SkyTimepickerComponent } from '../timepicker.component';
import { SkyTimepickerInputDirective } from '../timepicker.directive';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './timepicker-component.fixture.html',
  standalone: false,
})
export class TimepickerTestComponent {
  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent!: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker!: SkyTimepickerInputDirective;

  public disabled: boolean | undefined;

  public required: boolean | undefined;

  public returnFormat: string | undefined;

  public selectedTime: SkyTimepickerTimeOutput | undefined;

  public timeFormat: SkyTimepickerTimeFormatType | undefined = 'hh';
}
