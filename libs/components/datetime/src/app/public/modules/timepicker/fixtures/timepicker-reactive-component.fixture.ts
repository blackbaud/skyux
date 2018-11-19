import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  SkyTimepickerInputDirective
} from '../timepicker.directive';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SkyTimepickerTimeOutput } from '../timepicker.interface';
@Component({
  selector: 'sky-test-cmp',
  templateUrl: './timepicker-reactive-component.fixture.html'
})
export class TimepickerReactiveTestComponent implements OnInit {

  public timeFormat: string = 'hh';
  public returnFormat: string = undefined;
  public selectedTime: SkyTimepickerTimeOutput;

  @ViewChild(SkyTimepickerInputDirective)
  public timepicker: SkyTimepickerInputDirective;
  public timepickerForm: FormGroup;
  public timeControl: FormControl;

  public ngOnInit() {
    this.timeControl = new FormControl('2:55 AM', [Validators.required]);
    this.timepickerForm = new FormGroup({
      'time': this.timeControl
    });
  }
}
