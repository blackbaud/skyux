import {
  Injectable
} from '@angular/core';

import {
  fromEvent,
  Observable,
  ReplaySubject
} from 'rxjs';

function getWindow(): any {
  return window;
}

@Injectable()
export class StacheWindowRef {

  public get nativeWindow(): any {
    return getWindow();
  }

  get onResizeStream(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  public scrollEventStream = fromEvent(this.nativeWindow, 'scroll');

  private resizeSubject: ReplaySubject<Window>;

  constructor() {
    this.resizeSubject = new ReplaySubject();

    this.nativeWindow.addEventListener('resize', (event: UIEvent) => {
      this.onResize(event);
    });
  }

  private onResize(event: UIEvent): void {
    this.resizeSubject.next(<Window>event.target);
  }
}
