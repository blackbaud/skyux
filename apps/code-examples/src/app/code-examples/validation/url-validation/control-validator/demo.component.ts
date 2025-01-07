import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyValidators } from '@skyux/validation';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyInputBoxModule],
})
export class DemoComponent {
  protected get urlControl(): AbstractControl | null {
    return this.formGroup.get('url');
  }

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      url: new FormControl(undefined, [
        Validators.required,
        SkyValidators.url({
          rulesetVersion: 2,
        }),
      ]),
    });
  }
}
