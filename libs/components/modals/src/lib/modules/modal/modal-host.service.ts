import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SKY_STACKING_CONTEXT, SkyStackingContextService } from '@skyux/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

const modalHosts: SkyModalHostService[] = [];

const backdropZIndex = new BehaviorSubject<number>(0);
const backdropZIndexObs = backdropZIndex.asObservable();

const openModalCount = new BehaviorSubject<number>(0);
const openModalCountObs = openModalCount.asObservable();

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyModalHostService {
  public static get openModalCountChange(): Observable<number> {
    return openModalCountObs;
  }

  public static get backdropZIndexChange(): Observable<number> {
    return backdropZIndexObs;
  }

  /**
   * @deprecated Subscribe to `openModalCountChange` instead.
   */
  public static get openModalCount(): number {
    return modalHosts.length;
  }

  public static get fullPageModalCount(): number {
    const fullPageModals = modalHosts.filter((modal) => modal.fullPage);
    return fullPageModals.length;
  }

  /**
   * @deprecated Subscribe to `backdropZIndexChange` instead.
   */
  public static get backdropZIndex(): number {
    if (modalHosts.length > 0) {
      return SkyModalHostService.topModal.zIndex - 10;
    }
    return SkyStackingContextService.MODAL_BACKDROP_Z_INDEX;
  }

  public static get topModal(): SkyModalHostService {
    return modalHosts[modalHosts.length - 1];
  }

  public close = new Subject<void>();
  public fullPage = false;
  /**
   * @deprecated
   */
  public openHelp = new Subject<string>();
  public get zIndex(): number {
    return this.#zIndex;
  }

  #zIndex = SkyStackingContextService.MODAL_BACKDROP_Z_INDEX;

  constructor() {
    inject(SKY_STACKING_CONTEXT, { optional: true })
      ?.zIndex.pipe(takeUntilDestroyed())
      .subscribe((zIndex) => {
        this.#zIndex = zIndex;
      });
    modalHosts.push(this);
    this.#notifyBackdropZIndex();
    this.#notifyOpenModalCount();
  }

  public getModalZIndex(): number {
    return this.zIndex;
  }

  public onClose(): void {
    this.close.next();
  }

  /**
   * @deprecated
   */
  public onOpenHelp(helpKey: string): void {
    this.openHelp.next(helpKey);
  }

  public destroy(): void {
    modalHosts.splice(modalHosts.indexOf(this), 1);
    this.#notifyBackdropZIndex();
    this.#notifyOpenModalCount();
  }

  #notifyOpenModalCount(): void {
    openModalCount.next(modalHosts.length);
  }

  #notifyBackdropZIndex(): void {
    backdropZIndex.next(SkyModalHostService.backdropZIndex);
  }
}
