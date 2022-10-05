import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

const BASE_Z_INDEX = 1040;
const modalHosts: SkyModalHostService[] = [];

/**
 * @internal
 * @dynamic
 */
@Injectable({
  providedIn: 'root',
})
export class SkyModalHostService {
  public static get openModalCount(): number {
    return modalHosts.length;
  }

  public static get fullPageModalCount(): number {
    const fullPageModals = modalHosts.filter((modal) => modal.fullPage);
    return fullPageModals.length;
  }

  public static get backdropZIndex(): number {
    return BASE_Z_INDEX + modalHosts.length * 10;
  }

  public static get topModal(): SkyModalHostService {
    return modalHosts[modalHosts.length - 1];
  }

  public close = new Subject<void>();
  public fullPage = false;
  public openHelp = new Subject<string>();
  public zIndex: number;

  constructor() {
    this.zIndex = this.#calculateZIndex();
    modalHosts.push(this);
  }

  public getModalZIndex(): number {
    return this.zIndex;
  }

  public onClose(): void {
    this.close.next();
  }

  public onOpenHelp(helpKey: string) {
    this.openHelp.next(helpKey);
  }

  public destroy(): void {
    modalHosts.splice(modalHosts.indexOf(this), 1);
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
}
