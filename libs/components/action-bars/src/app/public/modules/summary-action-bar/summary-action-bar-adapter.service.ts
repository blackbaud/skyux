import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkySummaryActionBarType
} from './types';

@Injectable()
export class SkySummaryActionBarAdapterService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyWindowRefService
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public styleBodyElementForActionBar(summaryActionBarRef: ElementRef): void {
    const window = this.windowRef.getWindow();
    const body = window.document.body;
    const actionBarEl = summaryActionBarRef.nativeElement.querySelector('.sky-summary-action-bar');
    if (actionBarEl.style.visibility !== 'hidden') {
      this.renderer.setStyle(body, 'margin-bottom', actionBarEl.offsetHeight + 'px');
    }
  }

  public revertBodyElementStyles(): void {
    const window = this.windowRef.getWindow();
    const body = window.document.body;
    this.renderer.removeStyle(body, 'margin-bottom');
  }

  public styleModalFooter(): void {
    const window = this.windowRef.getWindow();
    const modalFooterEl = <HTMLElement>window.document.getElementsByClassName('sky-modal-footer-container')[0];
    this.renderer.setStyle(modalFooterEl, 'padding', 0);
  }

  public getSummaryActionBarType(el: Element): SkySummaryActionBarType {
    do {
      if (el.tagName.toLowerCase() === 'sky-modal-footer') {
        while (el.tagName.toLowerCase() !== 'sky-modal') {
          if (el.classList.contains('sky-modal-full-page')) {
            return SkySummaryActionBarType.FullPageModal;
          }
          el = el.parentElement;
        }
        return SkySummaryActionBarType.StandardModal;
      } else if (el.classList.contains('sky-tab')) {
        return SkySummaryActionBarType.Tab;
      }
      el = el.parentElement;
      // tslint:disable-next-line:no-null-keyword
    } while (el !== null && el.nodeType === 1);
    return SkySummaryActionBarType.Page;
  }
}
