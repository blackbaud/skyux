import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyTimepickerInputDirective
} from '../timepicker.directive';
import { SkyTimepickerTimeOutput } from '../timepicker.interface';
@Component({
  selector: 'sky-test-cmp',
  template: require('./timepicker-component.fixture.html')
})
export class TimepickerTestComponent {
  public timeFormat: string = 'hh';
  public returnFormat: string = undefined;
  public selectedTime: SkyTimepickerTimeOutput;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker: SkyTimepickerInputDirective;
  public isDisabled: boolean;
}
