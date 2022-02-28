import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SkyTimepickerComponent } from '../timepicker.component';
import { SkyTimepickerInputDirective } from '../timepicker.directive';
import { SkyTimepickerTimeOutput } from '../timepicker.interface';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './timepicker-reactive-component.fixture.html',
})
export class TimepickerReactiveTestComponent implements AfterViewInit, OnInit {
  @ViewChild(SkyTimepickerComponent)
  public timepickerComponent: SkyTimepickerComponent;

  @ViewChild(SkyTimepickerInputDirective)
  public timepickerDirective: SkyTimepickerInputDirective;

  public isDisabled: boolean;

  public returnFormat: string;

  public selectedTime: SkyTimepickerTimeOutput;

  public timeControl: FormControl;

  public timeControlValueAfterInit: any;

  public timeFormat: string;

  public timepickerForm: FormGroup;

  public ngAfterViewInit(): void {
    this.timeControlValueAfterInit = this.timeControl.value;
  }

  public ngOnInit(): void {
    this.timeControl = new FormControl('2:55 AM');
    this.timepickerForm = new FormGroup({
      time: this.timeControl,
    });
  }
}
