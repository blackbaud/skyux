import { AfterViewInit, Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
  standalone: false,
})
export class PhoneFieldComponent implements AfterViewInit {
  public phoneControl: UntypedFormControl;
  public phoneControlError: UntypedFormControl;
  public phoneControlInput: UntypedFormControl;

  public phoneForm: UntypedFormGroup;
  public phoneFormError: UntypedFormGroup;
  public phoneFormInput: UntypedFormGroup;

  protected readonly ready = new BehaviorSubject(false);

  constructor() {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });

    this.phoneControlError = new UntypedFormControl();
    this.phoneFormError = new UntypedFormGroup({
      phoneControlError: this.phoneControlError,
    });
    this.phoneControlError.setValue('bbb');
    this.phoneControlError.markAsTouched();

    this.phoneControlInput = new UntypedFormControl();
    this.phoneFormInput = new UntypedFormGroup({
      phoneControlInput: this.phoneControlInput,
    });
    this.phoneControlInput.setValue('2015550123');
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.ready.next(true), 400);
  }
}
