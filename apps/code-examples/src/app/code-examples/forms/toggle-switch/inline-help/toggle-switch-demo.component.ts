import { Component } from '@angular/core';
import {
  FormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { ToggleSwitchFormType } from './toggle-switch-form.type';

@Component({
  selector: 'app-toggle-switch-demo',
  templateUrl: './toggle-switch-demo.component.html',
})
export class ToggleSwitchDemoComponent {
  public formGroup: UntypedFormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group<ToggleSwitchFormType>({
      controlToggle: new UntypedFormControl(false),
      dynamicToggle: new UntypedFormControl({ value: true, disabled: true }),
    });
    this.formGroup.get('controlToggle')?.valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup.get('dynamicToggle')?.enable();
      } else {
        this.formGroup.get('dynamicToggle')?.disable();
      }
    });
  }

  public onHelpClick(): void {
    alert(`Help clicked`);
  }
}
