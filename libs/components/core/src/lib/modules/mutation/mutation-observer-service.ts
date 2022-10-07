import { Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyMutationObserverService {
  public create(callback: MutationCallback): MutationObserver {
    return new MutationObserver(callback);
  }
}
