import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyFileAttachmentLabelComponent } from './file-attachment-label.component';

/**
 * @deprecated
 * @internal
 */
@Injectable()
export class SkyFileAttachmentLabelService {
  public get elementId(): Observable<string | undefined> {
    return this.#elementIdObs;
  }

  #elementId = new BehaviorSubject<string | undefined>(undefined);
  #elementIdObs: Observable<string | undefined>;

  constructor() {
    this.#elementIdObs = this.#elementId.asObservable();
  }

  public registerLabelComponent(comp: SkyFileAttachmentLabelComponent): void {
    this.#elementId.next(comp.labelContentRef?.nativeElement.id);
  }
}
