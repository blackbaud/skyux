// adapted from ngx-clipboard

import { Injectable } from '@angular/core';

const clipboard = require("clipboard-polyfill/build/clipboard-polyfill.promise");

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

    return element.innerText;
  }

  private isValidInputElement(element: HTMLElement): boolean {
    return (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement);
  }
}
