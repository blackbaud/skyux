// spell-checker:ignore Colorpicker
import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

import { SkyColorpickerChangeColor } from './types/colorpicker-color';

/**
 * @internal
 */
@Directive({
  selector: '[skyColorpickerText]',
})
export class SkyColorpickerTextDirective {
  @Output()
  public newColorContrast = new EventEmitter<SkyColorpickerChangeColor>();
  @Input()
  public skyColorpickerText: any;
  @Input()
  public color: string;
  @Input()
  public maxRange: number;

  @HostListener('input', ['$event'])
  public changeInput(event: Event) {
    const element: HTMLInputElement = <HTMLInputElement>event.target;
    const elementValue = parseFloat(element.value);
    if (this.maxRange === undefined) {
      this.newColorContrast.emit({
        color: element.value,
        colorValue: undefined,
        maxRange: undefined,
      } as SkyColorpickerChangeColor);
    }

    if (
      !isNaN(elementValue) &&
      elementValue >= 0 &&
      elementValue <= this.maxRange
    ) {
      this.newColorContrast.emit({
        color: this.color,
        colorValue: elementValue,
        maxRange: this.maxRange,
      } as SkyColorpickerChangeColor);
    }
  }
}
