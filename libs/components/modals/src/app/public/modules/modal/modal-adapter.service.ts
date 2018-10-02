import {
  Injectable
} from '@angular/core';

import { SkyWindowRefService } from '@skyux/core';

@Injectable()
export class SkyModalAdapterService {
  private static readonly MODAL_BODY_FULL_CLASS = 'sky-modal-body-full-page';
  private static readonly MODAL_BODY_CLASS = 'sky-modal-body-open';

  private docRef: any;
  private bodyEl: HTMLElement;

  constructor(
    private windowRef: SkyWindowRefService) {
      this.docRef = this.windowRef.getWindow().document;
      this.bodyEl = this.windowRef.getWindow().document.body;
  }

  public addHostEl(): void {
    this.bodyEl.appendChild(this.docRef.createElement('sky-modal-host'));
  }

  public removeHostEl(): void {
    const element = this.docRef.querySelector('sky-modal-host');
    if (element) {
      this.bodyEl.removeChild(element);
    }
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
    return <HTMLElement>this.docRef.activeElement;
  }

  private addClassToBody(className: string): void {
    this.bodyEl.classList.add(className);
  }

  private removeClassFromBody(className: string): void {
    this.bodyEl.classList.remove(className);
  }
}
