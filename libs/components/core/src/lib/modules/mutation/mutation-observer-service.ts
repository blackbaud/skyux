import { Injectable } from '@angular/core';

// TODO: Prefix this service with `Sky` in a breaking change.
@Injectable({
  providedIn: 'root',
})
export class MutationObserverService {
  // TODO: Give the `callback` parameter a stricter type in a breaking change.
  public create(callback: any): MutationObserver {
    return new MutationObserver(callback);
  }
}
