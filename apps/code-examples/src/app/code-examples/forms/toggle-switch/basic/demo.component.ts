import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';

interface ToggleSwitchFormType {
  controlToggle: FormControl<boolean | null>;
  dynamicToggle: FormControl<boolean | null>;
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyToggleSwitchModule],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group<ToggleSwitchFormType>({
      controlToggle: new FormControl(false),
      dynamicToggle: new FormControl({ value: true, disabled: true }),
    });

    this.formGroup.get('controlToggle')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup.get('dynamicToggle')?.enable();
      } else {
        this.formGroup.get('dynamicToggle')?.disable();
      }
    });
  }
}
