import { ElementRef, Injectable, inject } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyToastService } from '@skyux/toast';

@Injectable({
  providedIn: 'root',
})
export class SkyClipboardService {
  #toastSvc = inject(SkyToastService);
  #windowRef = inject(SkyAppWindowRef);

  public copyTextContent(el: ElementRef, successMessage: string): void {
    const text = el.nativeElement.textContent.trim();
    this.#windowRef.nativeWindow.navigator.clipboard.writeText(text);
    this.#toastSvc.openMessage(successMessage, { autoClose: true });
  }
}
