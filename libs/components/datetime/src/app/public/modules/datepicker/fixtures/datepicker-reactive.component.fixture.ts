import {
  Component,
  ViewChild,
  OnInit
} from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import { SkyDatepickerInputDirective } from '../datepicker-input.directive';
@Component({
  selector: 'sky-test-cmp',
  templateUrl: './datepicker-reactive.component.fixture.html'
})
export class DatepickerReactiveTestComponent implements OnInit {

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;
  public minDate: Date;
  public maxDate: Date;
  public datepickerForm: FormGroup;
  public isDisabled: boolean;
  public dateControl: FormControl;
  public initialValue: Date | string;
  public noValidate: boolean = false;
  public startingDay = 0;

  public ngOnInit() {
    this.dateControl = new FormControl(this.initialValue);
    this.datepickerForm = new FormGroup({
      'date': this.dateControl
    });
  }
}
