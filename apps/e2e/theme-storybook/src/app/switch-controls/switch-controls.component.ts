import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-switch-controls',
  templateUrl: './switch-controls.component.html',
  styleUrls: ['./switch-controls.component.scss'],
  standalone: false,
})
export class SwitchControlsComponent {
  public myForm: FormGroup;

  public checkboxOptions = [
    { label: 'Checked Checkbox', checked: true, disabled: false },
    { label: 'Unchecked Checkbox', checked: false, disabled: false },
    { label: 'Disabled Checkbox', checked: false, disabled: true },
    { label: 'Disabled Checked Checkbox', checked: true, disabled: true },
  ];

  public checkboxIconGroupOptions = [
    { label: 'Bold', checked: true, icon: 'bold', disabled: false },
    { label: 'Italicized', checked: false, icon: 'italic', disabled: false },
    { label: 'Underlined', checked: false, icon: 'underline', disabled: false },
    { label: 'Indent', icon: 'indent', checked: false, disabled: true },
    { label: 'Outdent', icon: 'outdent', checked: true, disabled: true },
  ];

  public radioGroupIconOptions = [
    { name: 'Left align', value: '1', icon: 'align-left', disabled: false },
    { name: 'Center align', value: '2', icon: 'align-center', disabled: false },
    { name: 'Right align', value: '3', icon: 'align-right', disabled: false },
  ];

  public radioGroupIconDisabledOptions = [
    { name: 'Indent', value: '1', icon: 'indent', disabled: true },
    { name: 'Outdent', value: '2', icon: 'outdent', disabled: true },
  ];

  public radioOptions = [
    { name: 'Selected radio button', value: '1', disabled: false },
    { name: 'Unselected radio button', value: '2', disabled: false },
    { name: 'Disabled radio button', value: '3', disabled: true },
  ];

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      radioControl: this.radioOptions[0].name,
      radioIconGroupControl: this.radioGroupIconOptions[0].name,
      radioIconGroupDisabledControl: this.radioGroupIconDisabledOptions[0].name,
    });
  }
}
