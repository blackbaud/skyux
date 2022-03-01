import { Component, ViewChild } from '@angular/core';

import { SkyTimepickerComponent } from '../timepicker.component';
import { SkyTimepickerInputDirective } from '../timepicker.directive';
import { SkyTimepickerTimeOutput } from '../timepicker.interface';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './timepicker-component.fixture.html',
})
export class TimepickerTestComponent {
  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker: SkyTimepickerInputDirective;

  public disabled: boolean;

  public required: boolean;

  public returnFormat: string;

  public selectedTime: SkyTimepickerTimeOutput;

  public timeFormat = 'hh';
}
