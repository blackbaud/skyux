import { Component, OnInit, ViewChild, inject, input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyDatepickerInputDirective } from '../datepicker-input.directive';
import { SkyDatepickerComponent } from '../datepicker.component';

@Component({
  selector: 'sky-datepicker-reactive-test',
  templateUrl: './datepicker-reactive.component.fixture.html',
  standalone: false,
})
export class DatepickerReactiveTestComponent implements OnInit {
  public datepickerForm: UntypedFormGroup | undefined;

  public dateControl!: UntypedFormControl;

  public dateFormat = input<string | undefined>(undefined);

  public disableFormOnCreation = input(false);

  public initialValue = input<Date | string | undefined>(undefined);

  public isDisabled = input<boolean | undefined>(undefined);

  public maxDate = input<Date | undefined>(undefined);

  public minDate = input<Date | undefined>(undefined);

  public startAtDate = input<Date | undefined>(undefined);

  public noValidate = input(false);

  public startingDay = input(0);

  public strict = input<boolean | undefined>(undefined);

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective!: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker!: SkyDatepickerComponent;

  readonly #formBuilder = inject(UntypedFormBuilder);

  public ngOnInit() {
    this.dateControl = new UntypedFormControl(this.initialValue());

    this.datepickerForm = this.#formBuilder.group({
      date: this.dateControl,
    });
    if (this.disableFormOnCreation()) {
      this.datepickerForm.disable();
    }
  }
}
