import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export class SkyPageSummaryAdapterService {
  public updateKeyInfoLocation(elRef: ElementRef, isXS: boolean) {
    let el = elRef.nativeElement;
    let keyInfoContainerEl = el.querySelector('.sky-page-summary-key-info-container');

    if (isXS) {
      el.querySelector('.sky-page-summary-key-info-xs').appendChild(keyInfoContainerEl);
    } else {
      el.querySelector('.sky-page-summary-key-info-sm').appendChild(keyInfoContainerEl);
    }
  }
}
