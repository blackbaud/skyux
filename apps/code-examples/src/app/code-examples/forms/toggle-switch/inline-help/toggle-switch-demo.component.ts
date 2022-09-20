import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-toggle-switch-demo',
  templateUrl: './toggle-switch-demo.component.html',
})
export class ToggleSwitchDemoComponent {
  public checked = false;
  public disabled = true;

  public formGroup: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      dynamicToggle: new UntypedFormControl(true),
    });
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;

    const control = this.formGroup.get('dynamicToggle');

    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }

  public onHelpClick() {
    alert(`Help clicked`);
  }
}
