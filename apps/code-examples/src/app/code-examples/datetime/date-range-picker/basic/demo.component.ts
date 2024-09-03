import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyDateRangePickerModule } from '@skyux/datetime';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyDateRangePickerModule],
})
export class DemoComponent {
  protected get reactiveRange(): AbstractControl | null {
    return this.formGroup.get('lastDonation');
  }

  protected dateFormat: string | undefined;
  protected disabled = false;
  protected formGroup: FormGroup;
  protected hintText =
    'Donations received today are updated at the top of each hour.';
  protected labelText = 'Last donation';
  protected required = true;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      lastDonation: new FormControl({ value: '', disabled: this.disabled }),
    });
  }
}
