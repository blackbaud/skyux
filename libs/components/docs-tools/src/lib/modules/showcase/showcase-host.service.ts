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

  readonly #documentationGroup = new BehaviorSubject<
    SkyManifestDocumentationGroup | undefined
  >(undefined);

  readonly #documentationGroupObs = this.#documentationGroup.asObservable();

  public ngOnDestroy(): void {
    this.#documentationGroup.complete();
  }

  public updateGroup(group: SkyManifestDocumentationGroup | undefined): void {
    this.#documentationGroup.next(group);
  }
}
