import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
  input,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyColorpickerComponent } from '../colorpicker.component';
import { SkyColorpickerMessage } from '../types/colorpicker-message';
import { SkyColorpickerMessageType } from '../types/colorpicker-message-type';
import { SkyColorpickerResult } from '../types/colorpicker-result';

@Component({
  selector: 'sky-colorpicker-fixture',
  templateUrl: './colorpicker-component.fixture.html',
  standalone: false,
})
export class ColorpickerTestComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  public pickerButtonIcon: string | undefined;
  public helpKey = input<string | undefined>(undefined);
  public helpPopoverContent = input<string | undefined>(undefined);
  public helpPopoverTitle = input<string | undefined>(undefined);
  public hintText: string | undefined;
  public label: string | undefined;
  public labelledBy: string | undefined;
  public labelHidden = false;
  public labelText = input<string | undefined>(undefined);
  public required = false;
  public selectedHexType = 'hex6';
  public selectedColor: string | undefined = '#2889e5';
  public selectedOutputFormat = 'rgba';
  public stacked = false;
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
  public disabled = input<boolean>(false);
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
    this.#changeDetectorRef.markForCheck();
  }

  public setColorModel(value: string | undefined): void {
    this.colorModel = value;
    this.#changeDetectorRef.markForCheck();
  }
}
