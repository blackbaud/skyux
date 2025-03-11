import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  standalone: false,
})
export class RadioButtonComponent {
  public radioForm: FormGroup;

  public invalidRadioButtonOption: FormControl;

  public radioButtonOptions = [
    { name: 'Option 1', hint: 'Hint text 1', value: '1', disabled: false },
    { name: 'Option 2', hint: 'Hint text 2', value: '2', disabled: false },
    { name: 'Option 3', hint: 'Hint text 3', value: '3', disabled: true },
  ];

  public radioIconOptions = [
    {
      icon: 'table',
      iconName: 'table',
      label: 'Table',
      name: 'table',
      disabled: false,
    },
    {
      icon: 'list-ul',
      iconName: 'text-bullet-list-ltr',
      label: 'List',
      name: 'list',
      disabled: true,
    },
    {
      icon: 'map-marker',
      iconName: 'location',
      label: 'Map',
      name: 'map',
      disabled: false,
    },
  ];

  constructor(formBuilder: FormBuilder) {
    this.invalidRadioButtonOption = new FormControl(undefined, [
      (control: AbstractControl): ValidationErrors | null => {
        if (control.value === '1') {
          return { incorrectOption: true };
        }
        return null;
      },
    ]);

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
      invalidRadioButtonOption: this.invalidRadioButtonOption,
    });
  }
}
