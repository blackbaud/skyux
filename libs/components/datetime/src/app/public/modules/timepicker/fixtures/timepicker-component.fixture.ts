import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyTimepickerComponent
} from '../timepicker.component';

import {
  SkyTimepickerInputDirective
} from '../timepicker.directive';

import {
  SkyTimepickerTimeOutput
} from '../timepicker.interface';
@Component({
  selector: 'sky-test-cmp',
  template: require('./timepicker-component.fixture.html')
})
export class TimepickerTestComponent {
  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker: SkyTimepickerInputDirective;

  public timeFormat: string = 'hh';
  public returnFormat: string = undefined;
  public selectedTime: SkyTimepickerTimeOutput;
  public isDisabled: boolean;
}
