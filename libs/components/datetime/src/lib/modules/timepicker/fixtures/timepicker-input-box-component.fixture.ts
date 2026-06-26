import { Component, ViewChild, input, model } from '@angular/core';

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

  public readonly labelText = input('Time');

  public readonly returnFormat = input<string | undefined>(undefined);

  public readonly selectedTime = model<SkyTimepickerTimeOutput | undefined>(undefined);

  public readonly timeFormat = model<SkyTimepickerTimeFormatType | undefined>('hh');
}
