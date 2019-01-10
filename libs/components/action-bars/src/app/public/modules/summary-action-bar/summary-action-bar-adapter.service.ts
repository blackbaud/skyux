import {
  Injectable,
  Renderer2,
  RendererFactory2,
  OnDestroy
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subscription
} from 'rxjs/Subscription';

import 'rxjs/add/observable/fromEvent';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkySummaryActionBarType
} from './types';

@Injectable()
export class SkySummaryActionBarAdapterService implements OnDestroy {

  private renderer: Renderer2;

  private resizeSubscription: Subscription;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyWindowRefService
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  public styleBodyElementForActionBar(): void {
    const window = this.windowRef.getWindow();
    const body = window.document.body;
    const actionBarEl = <HTMLElement>window.document.getElementsByClassName('sky-summary-action-bar').item(0);
    this.renderer.setStyle(body, 'margin-bottom', actionBarEl.offsetHeight + 'px');
  }

  public revertBodyElementStyles(): void {
    const window = this.windowRef.getWindow();
    const body = window.document.body;
    this.renderer.removeStyle(body, 'margin-bottom');
  }

  public setupResizeListener(): void {
    const windowObj = this.windowRef.getWindow();
    this.resizeSubscription = Observable
      .fromEvent(windowObj, 'resize')
      .subscribe(() => {
        this.styleBodyElementForActionBar();
      });
  }

  public removeResizeListener(): void {
    this.resizeSubscription.unsubscribe();
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
      }
      el = el.parentElement;
      // tslint:disable-next-line:no-null-keyword
    } while (el !== null && el.nodeType === 1);
    return SkySummaryActionBarType.Page;
  }

  public styleModalFooter(): void {
    const window = this.windowRef.getWindow();
    const modalFooterEl = <HTMLElement>window.document.getElementsByClassName('sky-modal-footer-container')[0];
    this.renderer.setStyle(modalFooterEl, 'padding', 0);
  }
}
