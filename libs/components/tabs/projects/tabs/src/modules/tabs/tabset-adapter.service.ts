import { ElementRef, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyTabsetAdapterService {
  public get overflowChange(): Observable<boolean> {
    return this._overflowChange.asObservable();
  }

  private currentOverflow: boolean;

  private tabsetRef: ElementRef;

  private tabsOffsetLeft: number;

  private _overflowChange = new BehaviorSubject<boolean>(false);

  public registerTabset(tabsetRef: ElementRef): void {
    this.tabsetRef = tabsetRef;
    this.tabsOffsetLeft = this.getTabsOffsetLeft(tabsetRef.nativeElement);
  }

  /**
   * Detects if the tab buttons are wider than the tabset container.
   */
  public detectOverflow(): void {
    const nativeElement = this.tabsetRef.nativeElement;

    const tabsetRect = nativeElement
      .querySelector('.sky-tabset')
      .getBoundingClientRect();

    const tabButtonsRect = nativeElement
      .querySelector('.sky-tabset-tabs')
      .getBoundingClientRect();

    const tabExtraButtonsRect = nativeElement
      .querySelector('.sky-tabset-btns')
      .getBoundingClientRect();

    const tabButtonsWidth =
      tabButtonsRect.width + tabExtraButtonsRect.width + this.tabsOffsetLeft;

    const newOverflow = tabButtonsWidth > tabsetRect.width;
    if (this.currentOverflow !== newOverflow) {
      this.currentOverflow = newOverflow;
      this._overflowChange.next(this.currentOverflow);
    }
  }

  /**
   * Returns the number of pixels to the left of the first tab.
   */
  private getTabsOffsetLeft(tabsetEl: HTMLElement): number {
    const tabsetRect = tabsetEl.getBoundingClientRect();

    // The dropdown element is the first "tab" and always exists in the DOM, even when hidden.
    const firstTabRect = tabsetEl
      .querySelector('.sky-tabset-dropdown')
      .getBoundingClientRect();

    return firstTabRect.left - tabsetRect.left;
  }
}
