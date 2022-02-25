import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MutationObserverService {
  public create(callback: any): MutationObserver {
    return new MutationObserver(callback);
  }
}
