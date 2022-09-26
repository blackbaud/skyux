import { ElementRef, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyTabButtonAdapterService {
  public focusButtonLink(buttonEl: ElementRef): void {
    buttonEl.nativeElement.querySelector('a').focus();
  }
}
