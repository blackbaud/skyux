import { Injectable } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalAdapterService {
  private static readonly MODAL_BODY_FULL_CLASS = 'sky-modal-body-full-page';
  private static readonly MODAL_BODY_CLASS = 'sky-modal-body-open';

  private docRef: any;
  private bodyEl: HTMLElement;

  constructor(private windowRef: SkyAppWindowRef) {
    this.docRef = this.windowRef.nativeWindow.document;
    this.bodyEl = this.windowRef.nativeWindow.document.body;
  }

  public toggleFullPageModalClass(isAddFull: boolean): void {
    if (isAddFull) {
      this.addClassToBody(SkyModalAdapterService.MODAL_BODY_FULL_CLASS);
    } else {
      this.removeClassFromBody(SkyModalAdapterService.MODAL_BODY_FULL_CLASS);
    }
  }

  public setPageScroll(isAdd: boolean): void {
    if (isAdd) {
      this.addClassToBody(SkyModalAdapterService.MODAL_BODY_CLASS);
    } else {
      this.removeClassFromBody(SkyModalAdapterService.MODAL_BODY_CLASS);
    }
  }

  public getModalOpener(): HTMLElement {
    return this.docRef.activeElement;
  }

  private addClassToBody(className: string): void {
    this.bodyEl.classList.add(className);
  }

  private removeClassFromBody(className: string): void {
    this.bodyEl.classList.remove(className);
  }
}
