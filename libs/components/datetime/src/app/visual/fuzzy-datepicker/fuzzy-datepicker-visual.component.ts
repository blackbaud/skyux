import {
  Component,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  distinctUntilChanged
} from 'rxjs/operators';

import {
  SkyFuzzyDateService
} from '../../public/modules/datepicker/fuzzy-date.service';

@Component({
  selector: 'fuzzy-datepicker-visual',
  templateUrl: './fuzzy-datepicker-visual.component.html'
})
export class FuzzyDatepickerVisualComponent implements OnInit {

  public futureDisabled: boolean;

  public dateFormat: any = 'MM/DD/YYYY';

  public disabled = false;

  public maxDate: any;

  public minDate: any;

  public noValidate = false;

  public reactiveForm: FormGroup;

  public selectedFuzzyDate: any = { month: 4, day: 4, year: 2017 };

  public startingDay: number;

  public yearRequired: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private fuzzyDateService: SkyFuzzyDateService
  ) { }

  public get reactiveDate(): AbstractControl {
    return this.reactiveForm.get('selectedFuzzyDate');
  }

  // This property is only necessary to support the datepicker-calendar
  // on the page with the fuzzy datepicker.
  public get selectedDate(): any {
    let fuzzyMoment = this.fuzzyDateService.getMomentFromFuzzyDate(this.selectedFuzzyDate);
    let selectedDate: any;

    if (fuzzyMoment) {
      selectedDate = fuzzyMoment.toDate();
    }

    return selectedDate;
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedFuzzyDate: new FormControl('4/4/2017', Validators.required)
    });

    this.reactiveDate.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe((status: any) => {
        console.log('Status changed:', status);
      });

    this.reactiveDate.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: any) => {
        console.log('Value changed:', value);
      });
  }

  public setMinMaxDates(): void {
    this.minDate = { day: 1, month: 1, year: 2018 };
    this.maxDate = { day: 1, month: 1, year: 2020 };
  }

  public setStartingDay(): void {
    this.startingDay = 1;
  }

  public toggleYearRequired(): void {
    this.yearRequired = !this.yearRequired;
    console.log('year required: ' + this.yearRequired);
  }

  public toggleFutureDisabled(): void {
    this.futureDisabled = !this.futureDisabled;
    console.log('cannot be future: ' + this.futureDisabled);
  }

  public toggleDisabled(): void {
    if (this.reactiveDate.disabled) {
      this.reactiveDate.enable();
    } else {
      this.reactiveDate.disable();
    }

    this.disabled = !this.disabled;
  }

  public setValue(): void {
    this.reactiveDate.setValue(new Date('2/2/2001'));
    this.selectedFuzzyDate = new Date('2/2/2001');
  }

  public setInvalidValue(): void {
    this.reactiveDate.setValue('invalid');
    this.selectedFuzzyDate = 'invalid';
  }

  public get selectedDateForDisplay(): string {
    return JSON.stringify(this.selectedFuzzyDate);
  }

  public get reactiveFormSelectedDateForDisplay(): string {
    return JSON.stringify(this.reactiveDate.value);
  }
}
