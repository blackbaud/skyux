import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators } from '@angular/forms';

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
  public timepicker: SkyTimepickerInputDirective;

  public timeFormat: string = 'hh';
  public returnFormat: string = undefined;
  public selectedTime: SkyTimepickerTimeOutput;
  public timepickerForm: FormGroup;
  public timeControl: FormControl;
  public isDisabled: boolean;

  public ngOnInit() {
    this.timeControl = new FormControl('2:55 AM', [Validators.required]);
    this.timepickerForm = new FormGroup({
      'time': this.timeControl
    });
  }
}
