import { Injectable, inject } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyToastService } from '@skyux/toast';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDocsClipboardService {
  readonly #toastSvc = inject(SkyToastService);
  readonly #windowRef = inject(SkyAppWindowRef);

  /**
   * Saves an element's text content to the system clipboard.
   * @param el The element whose text should be copied.
   * @param successMessage The message to display after the action is successful.
   */
  public copyTextContent(el: HTMLElement, successMessage: string): void {
    const text = el.textContent?.trim() ?? '';

    this.#windowRef.nativeWindow.navigator.clipboard.writeText(text);

    this.#toastSvc.openMessage(successMessage, { autoClose: true });
  }
}
