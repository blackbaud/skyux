import {
  Component,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyColorpickerMessage
} from '../types/colorpicker-message';

import {
  SkyColorpickerMessageType
} from '../types/colorpicker-message-type';

import {
  SkyColorpickerComponent
} from '../colorpicker.component';

@Component({
  selector: 'sky-colorpicker-fixture',
  templateUrl: './colorpicker-component.fixture.html'
})
export class ColorpickerTestComponent {
  public label: string;
  public labelledBy: string;
  public selectedHexType = 'hex6';
  public selectedColor = '#2889e5';
  public selectedOutputFormat = 'rgba';
  public presetColors: string[] = [
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
  public inputType = 'text';
  public selectedTransparency = true;

  @ViewChild(SkyColorpickerComponent, {
    static: true
  })
  public colorpickerComponent: SkyColorpickerComponent;
  public colorpickerController = new Subject<SkyColorpickerMessage>();

  public colorModel: string;

  public sendMessage(type: SkyColorpickerMessageType) {
    this.colorpickerController.next({ type });
  }
}
