import { EventEmitter, Injectable } from '@angular/core';

const BASE_Z_INDEX = 1040;
const MODAL_HOSTS: SkyModalHostService[] = [];

/**
 * @internal
 * @dynamic
 */
@Injectable({
  providedIn: 'root',
})
export class SkyModalHostService {
  public static get openModalCount(): number {
    return MODAL_HOSTS.length;
  }

  public static get fullPageModalCount(): number {
    const fullPageModals = MODAL_HOSTS.filter((modal) => modal.fullPage);
    return fullPageModals.length;
  }

  public static get backdropZIndex(): number {
    return BASE_Z_INDEX + MODAL_HOSTS.length * 10;
  }

  public static get topModal(): SkyModalHostService {
    return MODAL_HOSTS[MODAL_HOSTS.length - 1];
  }

  public close = new EventEmitter<void>();
  public fullPage = false;
  public openHelp = new EventEmitter<any>();

  constructor() {
    MODAL_HOSTS.push(this);
  }

  public getModalZIndex(): number {
    let zIndex = BASE_Z_INDEX + 1;
    zIndex += (MODAL_HOSTS.indexOf(this) + 1) * 10;
    return zIndex;
  }

  public onClose(): void {
    this.close.emit();
  }

  public onOpenHelp(helpKey?: string) {
    this.openHelp.emit(helpKey);
  }

  public destroy(): void {
    MODAL_HOSTS.splice(MODAL_HOSTS.indexOf(this), 1);
  }
}
