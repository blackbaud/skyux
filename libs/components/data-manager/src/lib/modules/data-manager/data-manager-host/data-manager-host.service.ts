import { Injectable, signal } from '@angular/core';
import { SkyDataHost, SkyDataHostService } from '@skyux/lists';

import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface SkyDataHostChange {
  dataHost: SkyDataHost;
  sourceId: string;
}

@Injectable()
export class SkyDataManagerHostService extends SkyDataHostService {
  readonly #dataHostChange = new ReplaySubject<SkyDataHostChange>(1);
  readonly #dataHostId = signal('');

  public override hostId = this.#dataHostId.asReadonly();

  public getDataHostUpdates(sourceId: string): Observable<SkyDataHost> {
    return this.#dataHostChange.pipe(
      filter((c) => c.sourceId !== sourceId),
      map((c) => c.dataHost),
    );
  }

  public updateDataHost(dataHost: SkyDataHost, sourceId: string): void {
    if (dataHost.id) {
      this.#dataHostId.set(dataHost.id);
    }
    this.#dataHostChange.next({ dataHost, sourceId });
  }
}
