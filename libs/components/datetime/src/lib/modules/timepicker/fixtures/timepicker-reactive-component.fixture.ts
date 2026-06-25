import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { SkyTimepickerTimeFormatType } from '../timepicker-time-format-type';
import { SkyTimepickerTimeOutput } from '../timepicker-time-output';
import { SkyTimepickerComponent } from '../timepicker.component';
import { SkyTimepickerInputDirective } from '../timepicker.directive';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './timepicker-reactive-component.fixture.html',
  standalone: false,
})
export class TimepickerReactiveTestComponent implements AfterViewInit, OnInit {
  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent!: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepickerDirective!: SkyTimepickerInputDirective;

  public isDisabled: boolean | undefined;

  public returnFormat: string | undefined;

  public selectedTime: SkyTimepickerTimeOutput | undefined;

  public timeControl: UntypedFormControl | undefined;

  public timeControlValueAfterInit: any;

  public timeFormat: SkyTimepickerTimeFormatType | undefined;

  public timepickerForm: UntypedFormGroup | undefined;

  public ngAfterViewInit(): void {
    this.timeControlValueAfterInit = this.timeControl?.value;
  }

  public ngOnInit(): void {
    this.timeControl = new UntypedFormControl('2:55 AM');
    this.timepickerForm = new UntypedFormGroup({
      time: this.timeControl,
    });
  }
}
