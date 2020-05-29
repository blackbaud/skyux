import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  Observable,
  Subject
} from 'rxjs';

import {
  SkyDocsAnchorLink
} from '../type-definitions/anchor-link';

/**
 * @internal
 */
@Injectable()
export class SkyDocsDemoPageDomAdapterService implements OnDestroy {

  private get anchorLinks(): NodeListOf<HTMLAnchorElement> {
    return document.querySelectorAll('a.sky-docs-anchor-link');
  }

  private get currentUrl(): string {
    return this.windowRef.nativeWindow.location.href.split('#')[0];
  }

  private _anchorLinkClick = new Subject<SkyDocsAnchorLink>();

  constructor(
    private windowRef: SkyAppWindowRef
  ) { }

  public ngOnDestroy(): void {
    this.removeClickEventListeners();
  }

  public setupAnchorLinks(): void {
    this.anchorLinks.forEach((anchor: HTMLAnchorElement) => {
      const fragment = anchor.href.split('#')[1];
      const url = this.currentUrl;
      const href = `${url}#${fragment}`;
      anchor.href = href;
    });
  }

  public get anchorLinkClick(): Observable<SkyDocsAnchorLink> {
    if (this._anchorLinkClick.observers.length === 0) {
      this.addClickEventListeners();
    } else {
      this.removeClickEventListeners();
    }
    return this._anchorLinkClick;
  }

  public scrollToFragment(fragment: string): void {
    this.windowRef.nativeWindow.setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        this.windowRef.nativeWindow.scrollTo(0, element.offsetTop);
      }
    }, 250);
  }

  private addClickEventListeners(): void {
    // Wait for a tick to allow all anchors to be written.
    this.windowRef.nativeWindow.setTimeout(() => {
      this.anchorLinks.forEach((anchor: HTMLAnchorElement) => {
        anchor.addEventListener('click', this.eventListener);
      });
    });
  }

  private removeClickEventListeners(): void {
    this.anchorLinks.forEach(a => a.removeEventListener('click', this.eventListener));
  }

  private eventListener = (e: Event) => {
    e.preventDefault();
    this._anchorLinkClick.next({
      href: (e.target as HTMLAnchorElement).href
    });
  }

}
