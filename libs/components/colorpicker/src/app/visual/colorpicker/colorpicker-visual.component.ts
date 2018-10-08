import {
  Component
} from '@angular/core';

@Component({
  selector: 'colorpicker-visual',
  templateUrl: './colorpicker-visual.component.html'
})
export class ColorpickerVisualComponent {
  public color1: any;
  public selectedColor1: string = '#2889e5';
  public selectedOutputFormat1: string = 'rgba';
  public presetColors1 = [
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
    '#68AFEF'
  ];

  public color2: any;
  public selectedColor2: string = '#2889e5';
  public selectedOutputFormat2: string = 'rgba';
  public presetColors2 = [
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
    '#68AFEF'
  ];

}
