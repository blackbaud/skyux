import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkySummaryActionBarType
} from './types/summary-action-bar-type';

/**
 * @internal
 */
@Injectable()
export class SkySummaryActionBarAdapterService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyAppWindowRef
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public styleBodyElementForActionBar(summaryActionBarRef: ElementRef): void {
    const window = this.windowRef.nativeWindow;
    const body = window.document.body;
    const actionBarEl = summaryActionBarRef.nativeElement.querySelector('.sky-summary-action-bar');
    if (actionBarEl.style.visibility !== 'hidden') {
      this.renderer.setStyle(body, 'margin-bottom', actionBarEl.offsetHeight + 'px');
    }
  }

  public styleSplitViewElementForActionBar(summaryActionBarRef: ElementRef): void {
    const splitViewWorkspaceContent = document.querySelector('.sky-split-view-workspace-content');
    const splitViewWorkspaceFooter = document.querySelector('.sky-split-view-workspace-footer');
    const actionBarEl = summaryActionBarRef.nativeElement.querySelector('.sky-summary-action-bar');
    if (actionBarEl.style.visibility !== 'hidden') {
      this.renderer.setStyle(splitViewWorkspaceContent, 'padding-bottom', '20px');
      this.renderer.setStyle(splitViewWorkspaceFooter, 'padding', 0);
    }
  }

  public revertBodyElementStyles(): void {
    const window = this.windowRef.nativeWindow;
    const body = window.document.body;
    this.renderer.removeStyle(body, 'margin-bottom');
  }

  public revertSplitViewElementStyles(): void {
    const splitViewWorkspaceContent = document.querySelector('.sky-split-view-workspace-content');
    const splitViewWorkspaceFooter = document.querySelector('.sky-split-view-workspace-footer');
    this.renderer.setStyle(splitViewWorkspaceContent, 'padding-bottom', 'none');
    this.renderer.setStyle(splitViewWorkspaceFooter, 'padding', '10px');
  }

  public styleModalFooter(summaryActionBarRef: ElementRef): void {
    const modalFooterEls = document.getElementsByClassName('sky-modal-footer-container');
    for (let i = 0; i < modalFooterEls.length; i++) {
      if (modalFooterEls.item(i).contains(summaryActionBarRef.nativeElement)) {
        this.renderer.setStyle(modalFooterEls.item(i), 'padding', 0);
      }
    }
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
      } else if (el.tagName.toLowerCase() === 'sky-split-view-workspace') {
        return SkySummaryActionBarType.SplitView;
      }
      el = el.parentElement;
      // tslint:disable-next-line:no-null-keyword
    } while (el !== null && el.nodeType === 1);
    return SkySummaryActionBarType.Page;
  }
}
