import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

const BASE_Z_INDEX = 1040;
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
    return BASE_Z_INDEX + modalHosts.length * 10;
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
  public zIndex: number;

  constructor() {
    this.zIndex = this.#calculateZIndex();
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

  #calculateZIndex(): number {
    const zIndexArray = modalHosts.map((hostService) => hostService.zIndex);
    if (zIndexArray.length === 0) {
      return BASE_Z_INDEX + 11;
    } else {
      const currentMaxZIndex = Math.max(...zIndexArray);
      return currentMaxZIndex + 10;
    }
  }

  #notifyOpenModalCount(): void {
    openModalCount.next(modalHosts.length);
  }

  #notifyBackdropZIndex(): void {
    backdropZIndex.next(SkyModalHostService.backdropZIndex);
  }
}
