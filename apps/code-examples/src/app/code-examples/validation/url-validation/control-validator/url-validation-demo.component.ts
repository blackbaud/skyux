import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-url-validation-demo',
  templateUrl: './url-validation-demo.component.html',
})
export class UrlValidationDemoComponent implements OnInit {
  public get urlControl(): AbstractControl {
    return this.formGroup.get('url');
  }

  public formGroup: UntypedFormGroup;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.formGroup = this.#formBuilder.group({
      url: new UntypedFormControl(undefined, [
        Validators.required,
        SkyValidators.url({
          rulesetVersion: 2,
        }),
      ]),
    });
  }
}
