import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
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

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      url: new FormControl(undefined, [Validators.required, SkyValidators.url]),
    });
  }
}
