import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyUrlValidationOptions, SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-url-validation-control-validator',
  templateUrl: './url-validation-control-validator.component.html',
  standalone: false,
})
export class UrlValidationControlValidatorComponent implements OnInit {
  public get urlControl(): AbstractControl {
    return this.formGroup.get('url');
  }

  public formGroup: UntypedFormGroup;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public skyUrlValidationOptions: SkyUrlValidationOptions = {
    rulesetVersion: 1,
  };

  public ngOnInit(): void {
    this.formGroup = this.#formBuilder.group({
      url: new UntypedFormControl(undefined, [
        Validators.required,
        SkyValidators.url,
      ]),
    });
  }

  public toggleRuleset(): void {
    if (this.skyUrlValidationOptions.rulesetVersion === 1) {
      this.skyUrlValidationOptions.rulesetVersion = 2;
    } else if (this.skyUrlValidationOptions.rulesetVersion === 2) {
      this.skyUrlValidationOptions.rulesetVersion = 1;
    }
    const urlFormControl = this.formGroup.get('url');
    urlFormControl.clearValidators();
    urlFormControl.addValidators([
      Validators.required,
      SkyValidators.url(this.skyUrlValidationOptions),
    ]);
    this.formGroup.get('url').updateValueAndValidity();
  }
}
