// adapted from ngx-clipboard

import {
  Injectable
} from '@angular/core';

import * as clipboard from 'clipboard-polyfill';

@Injectable()
export class SkyCopyToClipboardService {
  public copyContent(element: HTMLElement) {
    let copyText = this.getTextFromElement(element);
    clipboard.writeText(copyText);
  }

  private getTextFromElement(element: HTMLElement): string {

    if (this.isValidInputElement(element)) {
      const targetEl = element as HTMLInputElement | HTMLTextAreaElement;
      return targetEl.value;
    }

    return element.textContent.trim();
  }

  private isValidInputElement(element: HTMLElement): boolean {
    return (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement);
  }
}
