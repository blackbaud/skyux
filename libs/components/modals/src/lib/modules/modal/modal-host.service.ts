import { EventEmitter, Injectable } from '@angular/core';

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

  public close = new EventEmitter<void>();
  public fullPage = false;
  public openHelp = new EventEmitter<any>();

  constructor() {
    modalHosts.push(this);
  }

  public getModalZIndex(): number {
    let zIndex = BASE_Z_INDEX + 1;
    zIndex += (modalHosts.indexOf(this) + 1) * 10;
    return zIndex;
  }

  public onClose(): void {
    this.close.emit();
  }

  public onOpenHelp(helpKey?: string) {
    this.openHelp.emit(helpKey);
  }

  public destroy(): void {
    modalHosts.splice(modalHosts.indexOf(this), 1);
  }
}
