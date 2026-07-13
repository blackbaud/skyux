import { ElementRef, Injectable, inject } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyToastAdapterService {
  readonly #windowRef = inject(SkyAppWindowRef);

  public scrollBottom(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;
    this.#windowRef.nativeWindow.setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    });
  }
}
