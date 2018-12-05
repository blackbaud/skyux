// adapted from ngx-clipboard

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SkyClipboardWindowRef } from '../shared';

@Injectable()
export class SkyCopyToClipboardService {
  private copyTextArea: HTMLTextAreaElement;
  private document: any;
  private renderer: Renderer2;

  constructor(
    private windowRef: SkyClipboardWindowRef,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
    this.document = this.windowRef.nativeWindow.document;
  }

  public copyContent(element: HTMLElement) {
    let copyTarget = this.getValidInputElement(element);
    this.copyFromInputElement(copyTarget);
  }

  public verifyCopyCommandBrowserSupport() {
    return this.document.queryCommandSupported('copy');
  }

  private copyFromInputElement(copyTarget: HTMLInputElement | HTMLTextAreaElement) {
    copyTarget.select();
    this.document.execCommand('copy');
    this.clearSelection(copyTarget);
  }

  private getValidInputElement(element: HTMLElement): HTMLInputElement | HTMLTextAreaElement {

    if (this.isValidInputElement(element)) {
      return element as HTMLInputElement | HTMLTextAreaElement;
    }

    return this.createTextAreaFromElement(element);
  }

  private isValidInputElement(element: HTMLElement): boolean {
    return (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement);
  }

  private clearSelection(inputElement: HTMLInputElement | HTMLTextAreaElement) {
    inputElement.blur();
    this.windowRef.nativeWindow.getSelection().removeAllRanges();
  }

  private createTextAreaFromElement(element: HTMLElement): HTMLTextAreaElement {
    if (!this.copyTextArea) {
        const copyTextAreaStyles = `
          font-size: 12px;
          border: 0;
          padding: 0;
          margin: 0;
          position: absolute;
          left: -9999px;
          top: -9999px`;

      this.copyTextArea = this.document.createElement('textarea');
      this.copyTextArea.setAttribute('style', copyTextAreaStyles);
      this.copyTextArea.setAttribute('readonly', '');
      this.renderer.appendChild(this.document.body, this.copyTextArea);
    }

    this.copyTextArea.value = element.innerText.trim();

    return this.copyTextArea;
  }
}
