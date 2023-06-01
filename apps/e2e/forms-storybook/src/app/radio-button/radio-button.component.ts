import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent {
  public radioForm: FormGroup;

  public radioButtonOptions = [
    { name: 'Option 1', value: '1', disabled: false },
    { name: 'Option 2', value: '2', disabled: false },
    { name: 'Option 3', value: '3', disabled: true },
  ];

  public radioIconOptions = [
    { icon: 'table', label: 'Table', name: 'table', disabled: false },
    { icon: 'list', label: 'List', name: 'list', disabled: true },
    { icon: 'map-marker', label: 'Map', name: 'map', disabled: false },
  ];

  public radioButtonSelectedValue = this.radioButtonOptions[0].value;
  public radioIconSelectedValue = this.radioIconOptions[0].name;
  public radioButtonDisabledValue = this.radioButtonOptions[0].value;
  public radioIconDisabledValue = this.radioIconOptions[0].name;
  public radioButtonUnselectedValue = '';
  public radioIconUnselectedValue = '';

  constructor(formBuilder: FormBuilder) {
    this.radioForm = formBuilder.group({
      radioButtonOption: this.radioButtonOptions[0].value,
      radioIconOption: this.radioIconOptions[0].name,
      noDefaultRadioButtonOption: '',
      noDefaultRadioIconOption: '',
      disabledRadioButtonOption: new FormControl({
        value: this.radioButtonOptions[0].value,
        disabled: true,
      }),
      disabledIconButtonOption: new FormControl({
        value: this.radioIconOptions[0].name,
        disabled: true,
      }),
    });
  }
}
