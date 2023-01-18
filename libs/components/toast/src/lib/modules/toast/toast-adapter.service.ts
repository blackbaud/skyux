import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyToastAdapterService {
  #windowRef: SkyAppWindowRef;
  constructor(windowRef: SkyAppWindowRef) {
    this.#windowRef = windowRef;
  }

  public scrollBottom(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;
    this.#windowRef.nativeWindow.setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    });
  }

  public getToastId(containerRef: ViewContainerRef): number {
    return +containerRef.element.nativeElement.dataset.toastId;
  }
}
