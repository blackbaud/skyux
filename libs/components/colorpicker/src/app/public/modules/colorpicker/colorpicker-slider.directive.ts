// spell-checker:ignore Colorpicker
import {
  Directive,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import {
  SkyColorpickerChangeAxis
} from './types/colorpicker-axis';

/**
 * @internal
 */
@Directive({
  selector: '[skyColorpickerSlider]'
})
export class SkyColorpickerSliderDirective {

  @Output()
  public newColorContrast = new EventEmitter<SkyColorpickerChangeAxis>();
  @Input()
  public skyColorpickerSlider: string;
  @Input()
  public color: string;
  @Input()
  public xAxis: number;
  @Input()
  public yAxis: number;

  private listenerMove: any;
  private listenerStop: any;

  constructor(private el: ElementRef) {
    this.listenerMove = (event: any) => { this.move(event); };
    this.listenerStop = () => { this.stop(); };
  }

  public setCursor(event: any) {
    let height = this.el.nativeElement.offsetHeight;
    let width = this.el.nativeElement.offsetWidth;
    let xAxis = Math.max(0, Math.min(this.getX(event), width));
    let yAxis = Math.max(0, Math.min(this.getY(event), height));
    if (this.xAxis !== undefined && this.yAxis !== undefined) {
      this.newColorContrast.emit({
        xCoordinate: xAxis / width,
        yCoordinate: (1 - yAxis / height),
        xAxis: this.xAxis,
        yAxis: this.yAxis
      } as SkyColorpickerChangeAxis);
    } else {
      this.newColorContrast.emit({
        xCoordinate: xAxis / width,
        maxRange: this.xAxis
      } as SkyColorpickerChangeAxis);
    }
    /* // No vertical bars
     if (this.xAxis === undefined && this.yAxis !== undefined) {
          this.newColorContrast.emit({ yCoordinate: yAxis / height, maxRange: this.yAxis });
    } */

  }

  public move(event: any) {
    event.preventDefault();
    this.setCursor(event);
  }
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  public start(event: MouseEvent) {
    this.setCursor(event);
    document.addEventListener('mousemove', this.listenerMove);
    document.addEventListener('touchmove', this.listenerMove);
    document.addEventListener('mouseup', this.listenerStop);
    document.addEventListener('touchend', this.listenerStop);
  }

  public stop() {
    document.removeEventListener('mousemove', this.listenerMove);
    document.removeEventListener('touchmove', this.listenerMove);
    document.removeEventListener('mouseup', this.listenerStop);
    document.removeEventListener('touchend', this.listenerStop);
  }

  public getX(event: any): number {
    return (
      /* Ignoring event.touches as tests are not run on a touch device. */
      /* istanbul ignore next */
      event.pageX !== undefined ? event.pageX : event.touches[0].pageX)
      - this.el.nativeElement.getBoundingClientRect().left
      - window.pageXOffset;
  }
  public getY(event: any): number {
    return (
      /* Ignoring event.touches as tests are not run on a touch device. */
      /* istanbul ignore next */
      event.pageY !== undefined ? event.pageY : event.touches[0].pageY)
      - this.el.nativeElement.getBoundingClientRect().top
      - window.pageYOffset;
  }
}
