import { Injectable } from '@angular/core';

@Injectable()
export class MutationObserverService {
  public create(callback: any): MutationObserver {
    return new MutationObserver(callback);
  }
}
