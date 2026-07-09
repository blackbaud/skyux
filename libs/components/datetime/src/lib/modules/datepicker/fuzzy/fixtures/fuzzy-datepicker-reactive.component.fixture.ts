import { Component, OnInit, ViewChild, inject, input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'sky-fuzzy-datepicker-reactive-test',
  templateUrl: './fuzzy-datepicker-reactive.component.fixture.html',
  standalone: false,
})
export class FuzzyDatepickerReactiveTestComponent implements OnInit {
  public futureDisabled = input<boolean | undefined>(undefined);

  public dateControl!: UntypedFormControl;

  public dateFormat = input<any>(undefined);

  public datepickerForm: UntypedFormGroup | undefined;

  public initialValue = input<any>(undefined);

  public isDisabled = input<boolean | undefined>(undefined);

  public maxDate = input<any>(undefined);

  public minDate = input<any>(undefined);

  public startAtDate = input<any>(undefined);

  public noValidate = input(false);

  public startingDay = input(0);

  public yearRequired = input<boolean | undefined>(undefined);

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective!: SkyFuzzyDatepickerInputDirective;

  readonly #formBuilder = inject(UntypedFormBuilder);

  public ngOnInit(): void {
    this.dateControl = new UntypedFormControl(this.initialValue());

    this.datepickerForm = this.#formBuilder.group({
      date: this.dateControl,
    });
  }
}
