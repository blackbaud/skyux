import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  standalone: false,
})
export class ColorpickerComponent {
  public colorForm: FormGroup;

  public swatches12: string[] = [
    '#333333',
    '#888888',
    '#EFEFEF',
    '#FFF',
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
    '#A1B1A7',
    '#68AFEF',
  ];

  public swatches6: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  public readonly ready = of(true).pipe(delay(1200));

  constructor(formBuilder: FormBuilder) {
    this.colorForm = formBuilder.group({
      colorOne: new FormControl('#f00'),
      colorTwo: new FormControl('#ff0'),
      colorThree: new FormControl({ value: '#000', disabled: true }),
      colorFour: new FormControl('#00f'),
      colorFive: new FormControl('#00f', { validators: [Validators.required] }),
      colorSix: new FormControl('#00f'),
      colorSeven: new FormControl('#00f', {
        validators: [
          (): ValidationErrors | null => {
            return { intentionalError: true };
          },
        ],
      }),
      colorEight: new FormControl('#00f'),
    });
  }
}
