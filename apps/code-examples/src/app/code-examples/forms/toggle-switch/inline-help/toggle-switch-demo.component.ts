import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ToggleSwitchFormType } from './toggle-switch-form.type';

@Component({
  selector: 'app-toggle-switch-demo',
  templateUrl: './toggle-switch-demo.component.html',
})
export class ToggleSwitchDemoComponent {
  public formGroup: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group<ToggleSwitchFormType>({
      controlToggle: new FormControl(false),
      dynamicToggle: new FormControl({ value: true, disabled: true }),
    });
    this.formGroup.get('controlToggle').valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup.get('dynamicToggle').enable();
      } else {
        this.formGroup.get('dynamicToggle').disable();
      }
    });
  }

  public onHelpClick(): void {
    alert(`Help clicked`);
  }
}
