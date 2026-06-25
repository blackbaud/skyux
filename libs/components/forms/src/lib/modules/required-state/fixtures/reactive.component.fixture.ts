import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TestControlComponent } from './test-control.component.fixture';

@Component({
  imports: [ReactiveFormsModule, TestControlComponent],
  template: `<form [formGroup]="formGroup">
    <sky-test-control formControlName="foobar" />
  </form>`,
})
export class ReactiveTestComponent {
  protected foobar = new FormControl('', { validators: [] });

  protected formGroup = inject(FormBuilder).group({
    foobar: this.foobar,
  });

  public makeRequired(): void {
    this.foobar.addValidators(Validators.required);
    this.foobar.updateValueAndValidity();
  }
}
