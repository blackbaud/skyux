import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
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

  constructor(formBuilder: FormBuilder) {
    this.colorForm = formBuilder.group({
      colorOne: new FormControl('#f00'),
      colorTwo: new FormControl('#ff0'),
      colorThree: new FormControl({ value: '#000', disabled: true }),
      colorFour: new FormControl('#00f'),
    });
  }
}
