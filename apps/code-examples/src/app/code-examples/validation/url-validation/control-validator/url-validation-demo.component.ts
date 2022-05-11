import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SkyUrlValidationOptions, SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-url-validation-demo',
  templateUrl: './url-validation-demo.component.html',
})
export class UrlValidationDemoComponent implements OnInit {
  public get urlControl(): AbstractControl {
    return this.formGroup.get('url');
  }

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public skyUrlValidationOptions: SkyUrlValidationOptions = {
    rulesetVersion: 1,
  };

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      url: new FormControl(undefined, [Validators.required, SkyValidators.url]),
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
