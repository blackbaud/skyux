import {
  ElementRef,
  Injectable
} from '@angular/core';

@Injectable()
export class SkyDatepickerAdapterService {

  private el: HTMLElement;

  public init(elRef: ElementRef) {
    this.el = elRef.nativeElement;
  }

  public elementIsFocused(): boolean {
    const focusedEl = document.activeElement;

    return this.el.contains(focusedEl);
  }

  public elementIsVisible(): boolean {
    const styles = this.el && getComputedStyle(this.el);

    return styles && styles.visibility === 'visible';
  }
}
