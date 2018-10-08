import { Component, ViewChild } from '@angular/core';
import { SkyColorpickerComponent } from '../';
import { SkyColorpickerMessage, SkyColorpickerMessageType } from '../types';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sky-colorpicker-fixture',
  templateUrl: './colorpicker-component.fixture.html'
})
export class ColorpickerTestComponent {
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

  @ViewChild(SkyColorpickerComponent)
  public colorpickerComponent: SkyColorpickerComponent;
  public colorpickerController = new Subject<SkyColorpickerMessage>();

  public colorModel: string;

  public sendMessage(type: SkyColorpickerMessageType) {
    this.colorpickerController.next({ type });
  }
}
