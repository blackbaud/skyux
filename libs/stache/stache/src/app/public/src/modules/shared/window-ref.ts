import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

function getWindow(): any {
  return window;
}

@Injectable()
export class StacheWindowRef {

  get nativeWindow(): any {
    return getWindow();
  }

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  private resizeSubject: ReplaySubject<Window>;

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new ReplaySubject();
    this.eventManager.addGlobalEventListener('window', 'resize', (event: UIEvent) => {
      this.onResize(event);
    });
  }

  private onResize(event: UIEvent): void {
    this.resizeSubject.next(<Window>event.target);
  }
}
