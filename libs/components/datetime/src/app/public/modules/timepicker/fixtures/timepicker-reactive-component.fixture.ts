import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  FormGroup,
  FormControl
} from '@angular/forms';

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
  templateUrl: './timepicker-reactive-component.fixture.html'
})
export class TimepickerReactiveTestComponent implements OnInit {

  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepickerDirective: SkyTimepickerInputDirective;

  public isDisabled: boolean;

  public returnFormat: string;

  public selectedTime: SkyTimepickerTimeOutput;

  public timeControl: FormControl;

  public timeFormat: string;

  public timepickerForm: FormGroup;

  public ngOnInit(): void {
    this.timeControl = new FormControl('2:55 AM');
    this.timepickerForm = new FormGroup({
      'time': this.timeControl
    });
  }
}
