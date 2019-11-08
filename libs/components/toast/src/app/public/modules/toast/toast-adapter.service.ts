// #region imports
import {
  ElementRef,
  Injectable,
  ViewContainerRef
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';
// #endregion

@Injectable()
export class SkyToastAdapterService {

  constructor(
    private windowRef: SkyWindowRefService
  ) { }

  public scrollBottom(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;
    this.windowRef.getWindow().setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    });
  }

  public getToastId(containerRef: ViewContainerRef): number {
    return +containerRef.element.nativeElement.dataset.toastId;
  }
}
