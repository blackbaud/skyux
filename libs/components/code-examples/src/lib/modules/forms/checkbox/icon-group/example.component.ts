import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

/**
 * @title Icon checkbox group
 */
@Component({
  selector: 'app-forms-checkbox-icon-group-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyCheckboxModule],
})
export class FormsCheckboxIconGroupExampleComponent {
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
