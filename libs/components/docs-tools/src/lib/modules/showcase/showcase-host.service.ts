import { Injectable, OnDestroy } from '@angular/core';
import { type SkyManifestDocumentationGroup } from '@skyux/manifest';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyDocsShowcaseHostService implements OnDestroy {
  public get documentationGroup(): Observable<
    SkyManifestDocumentationGroup | undefined
  > {
    return this.#documentationGroupObs;
  }

  #documentationGroup = new BehaviorSubject<
    SkyManifestDocumentationGroup | undefined
  >(undefined);

  #documentationGroupObs = this.#documentationGroup.asObservable();

  public updateGroup(group: SkyManifestDocumentationGroup): void {
    this.#documentationGroup.next(group);
  }

  public ngOnDestroy(): void {
    this.#documentationGroup.complete();
  }
}
