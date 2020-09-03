import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

import {
  SkyFuzzyDate
} from '../../public/public_api';

@Component({
  selector: 'app-datepicker-docs',
  templateUrl: './datepicker-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerDocsComponent implements OnInit {

  public fuzzyForm: FormGroup;

  public fuzzyMaxDate: SkyFuzzyDate;

  public fuzzyMinDate: SkyFuzzyDate;

  public fuzzyFutureDisabled: boolean = false;

  public fuzzyYearRequired: boolean = false;

  public standardForm: FormGroup;

  public standardMaxDate: Date;

  public standardMinDate: Date;

  constructor(
    private changeRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.fuzzyForm = this.formBuilder.group({
      myDate: new FormControl(new Date(1955, 10, 5))
    });
    this.standardForm = this.formBuilder.group({
      myDate: new FormControl(new Date(1955, 10, 5))
    });
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.standardValidation === true) {
      this.standardMaxDate = new Date(2020, 0, 31);
      this.standardMinDate = new Date(2020, 0, 1);
    } else if (change.standardValidation === false) {
      this.standardMaxDate = undefined;
      this.standardMinDate = undefined;
    }

    if (change.fuzzyValidation === true) {
      this.fuzzyMaxDate = { day: 31, month: 1, year: 2020 };
      this.fuzzyMinDate = { day: 1, month: 1, year: 2020 };
    } else if (change.fuzzyValidation === false) {
      this.fuzzyMaxDate = undefined;
      this.fuzzyMinDate = undefined;
    }

    if (change.fuzzyFutureDates !== undefined) {
      this.fuzzyFutureDisabled = !change.fuzzyFutureDates;
    }

    if (change.fuzzyYearRequired !== undefined) {
      this.fuzzyYearRequired = change.fuzzyYearRequired;
    }

    this.changeRef.markForCheck();
  }

}
