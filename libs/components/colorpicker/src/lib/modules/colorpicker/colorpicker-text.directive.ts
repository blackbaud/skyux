import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { SkyColorpickerChangeColor } from './types/colorpicker-color';

/**
 * @internal
 */
@Directive({
  selector: '[skyColorpickerText]',
  standalone: false,
})
export class SkyColorpickerTextDirective {
  @Output()
  public newColorContrast = new EventEmitter<SkyColorpickerChangeColor>();
  @Input()
  public skyColorpickerText: string | undefined;
  @Input()
  public color: string | undefined;
  @Input()
  public maxRange: number | undefined;

  @HostListener('input', ['$event'])
  protected changeInput(event: Event): void {
    const element = event.target as HTMLInputElement;
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
      this.maxRange &&
      elementValue <= this.maxRange
    ) {
      this.newColorContrast.emit({
        // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        color: this.color!,
        colorValue: elementValue,
        maxRange: this.maxRange,
      });
    }
  }
}
