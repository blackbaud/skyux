import { ElementRef, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyPageSummaryAdapterService {
  public updateKeyInfoLocation(elRef: ElementRef, isXS: boolean) {
    const el = elRef.nativeElement;
    const keyInfoContainerEl = el.querySelector(
      '.sky-page-summary-key-info-container'
    );

    if (isXS) {
      el.querySelector('.sky-page-summary-key-info-xs').appendChild(
        keyInfoContainerEl
      );
    } else {
      el.querySelector('.sky-page-summary-key-info-sm').appendChild(
        keyInfoContainerEl
      );
    }
  }
}
