import { Component, ViewChild } from '@angular/core';
import { SkyIconType } from '@skyux/indicators';

import { Subject } from 'rxjs';

import { SkyColorpickerComponent } from '../colorpicker.component';
import { SkyColorpickerMessage } from '../types/colorpicker-message';
import { SkyColorpickerMessageType } from '../types/colorpicker-message-type';
import { SkyColorpickerResult } from '../types/colorpicker-result';

@Component({
  selector: 'sky-colorpicker-fixture',
  templateUrl: './colorpicker-component.fixture.html',
})
export class ColorpickerTestComponent {
  public pickerButtonIcon: string | undefined;
  public pickerButtonIconType: SkyIconType = 'fa';
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public label: string | undefined;
  public labelledBy: string | undefined;
  public labelText: string | undefined;
  public selectedHexType = 'hex6';
  public selectedColor: string | undefined = '#2889e5';
  public selectedOutputFormat = 'rgba';
  public presetColors = [
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
  public inputType = 'text';
  public selectedTransparency = true;
  public disabled = false;
  public id: string | undefined;

  @ViewChild(SkyColorpickerComponent, {
    static: true,
  })
  public colorpickerComponent!: SkyColorpickerComponent;
  public colorpickerController = new Subject<SkyColorpickerMessage>();

  public colorModel: string | undefined;
  public lastColorApplied: SkyColorpickerResult | undefined;

  public sendMessage(type: SkyColorpickerMessageType) {
    this.colorpickerController.next({ type });
  }
}
