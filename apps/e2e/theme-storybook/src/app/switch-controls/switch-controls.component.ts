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
    { label: 'Bold', checked: true, iconName: 'text-bold', disabled: false },
    {
      label: 'Italicized',
      checked: false,
      iconName: 'text-italic',
      disabled: false,
    },
    {
      label: 'Underlined',
      checked: false,
      iconName: 'text-underline',
      disabled: false,
    },
    {
      label: 'Indent',
      iconName: 'text-indent-increase',
      checked: false,
      disabled: true,
    },
    {
      label: 'Outdent',
      iconName: 'text-indent-decrease',
      checked: true,
      disabled: true,
    },
  ];

  public radioGroupIconOptions = [
    {
      name: 'Left align',
      value: '1',
      iconName: 'text-align-left',
      disabled: false,
    },
    {
      name: 'Center align',
      value: '2',
      iconName: 'text-align-center',
      disabled: false,
    },
    {
      name: 'Right align',
      value: '3',
      iconName: 'text-align-right',
      disabled: false,
    },
  ];

  public radioGroupIconDisabledOptions = [
    {
      name: 'Indent',
      value: '1',
      iconName: 'text-indent-increase',
      disabled: true,
    },
    {
      name: 'Outdent',
      value: '2',
      iconName: 'text-indent-decrease',
      disabled: true,
    },
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
