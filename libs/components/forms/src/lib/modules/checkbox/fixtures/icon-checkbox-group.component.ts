import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { SkyCheckboxModule } from '../checkbox.module';

@Component({
  selector: 'sky-icon-checkbox-group',
  templateUrl: './icon-checkbox-group.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyCheckboxModule],
})
export class SkyIconCheckboxGroupComponent {
  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      bold: new FormControl(false),
      italic: new FormControl(false),
      underline: new FormControl(false),
    });
  }

  public onSubmit(): void {
    console.log(this.formGroup.value);
  }
}
