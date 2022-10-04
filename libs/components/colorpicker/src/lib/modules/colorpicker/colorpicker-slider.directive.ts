// spell-checker:ignore Colorpicker
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { SkyColorpickerChangeAxis } from './types/colorpicker-axis';

/**
 * @internal
 */
@Directive({
  selector: '[skyColorpickerSlider]',
})
export class SkyColorpickerSliderDirective {
  @Output()
  public newColorContrast = new EventEmitter<SkyColorpickerChangeAxis>();
  @Input()
  public skyColorpickerSlider: string | undefined;
  @Input()
  public color: string | undefined;
  @Input()
  public xAxis: number | undefined;
  @Input()
  public yAxis: number | undefined;

  #listenerMove: (event: MouseEvent | TouchEvent) => void;
  #listenerStop: () => void;

  constructor(private el: ElementRef) {
    this.#listenerMove = (event) => {
      this.move(event);
    };
    this.#listenerStop = () => {
      this.stop();
    };
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  public start(event: MouseEvent) {
    this.#setCursor(event);
    document.addEventListener('mousemove', this.#listenerMove);
    document.addEventListener('touchmove', this.#listenerMove);
    document.addEventListener('mouseup', this.#listenerStop);
    document.addEventListener('touchend', this.#listenerStop);
  }

  #setCursor(event: MouseEvent | TouchEvent) {
    const height = this.el.nativeElement.offsetHeight;
    const width = this.el.nativeElement.offsetWidth;
    const xAxis = Math.max(0, Math.min(this.getX(event), width));
    const yAxis = Math.max(0, Math.min(this.getY(event), height));
    if (this.xAxis !== undefined && this.yAxis !== undefined) {
      this.newColorContrast.emit({
        xCoordinate: xAxis / width,
        yCoordinate: 1 - yAxis / height,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
      } as SkyColorpickerChangeAxis);
    } else {
      this.newColorContrast.emit({
        xCoordinate: xAxis / width,
        maxRange: this.xAxis,
      } as SkyColorpickerChangeAxis);
    }
    /* // No vertical bars
     if (this.xAxis === undefined && this.yAxis !== undefined) {
          this.newColorContrast.emit({ yCoordinate: yAxis / height, maxRange: this.yAxis });
    } */
  }

  public stop() {
    document.removeEventListener('mousemove', this.#listenerMove);
    document.removeEventListener('touchmove', this.#listenerMove);
    document.removeEventListener('mouseup', this.#listenerStop);
    document.removeEventListener('touchend', this.#listenerStop);
  }

  public move(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.#setCursor(event);
  }

  public getX(event: MouseEvent | TouchEvent): number {
    /* Ignoring event.touches as tests are not run on a touch device. */
    /* istanbul ignore next */
    return (
      ('pageX' in event ? event.pageX : event.touches[0].pageX) -
      this.el.nativeElement.getBoundingClientRect().left -
      window.pageXOffset
    );
  }
  public getY(event: MouseEvent | TouchEvent): number {
    /* Ignoring event.touches as tests are not run on a touch device. */
    /* istanbul ignore next */
    return (
      ('pageY' in event ? event.pageY : event.touches[0].pageY) -
      this.el.nativeElement.getBoundingClientRect().top -
      window.pageYOffset
    );
  }
}
