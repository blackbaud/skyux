import {
  ElementRef,
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyDropdownAdapterService {

  public elementHasFocus(elementRef: ElementRef): boolean {
    const focusedEl = document.activeElement;
    const nativeEl = elementRef.nativeElement;

    return nativeEl.contains(focusedEl);
  }
}
