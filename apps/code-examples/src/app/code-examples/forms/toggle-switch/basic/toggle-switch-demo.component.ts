import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch-demo',
  templateUrl: './toggle-switch-demo.component.html',
})
export class ToggleSwitchDemoComponent {
  public checked = false;
  public disabled = true;

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      dynamicToggle: new FormControl(true),
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
}
