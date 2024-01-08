import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyCheckboxModule],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false),
      terms: new FormControl(false),
    });
  }

  protected onSubmit(): void {
    this.formGroup.markAllAsTouched();

    console.log(this.formGroup.value);
  }
}
