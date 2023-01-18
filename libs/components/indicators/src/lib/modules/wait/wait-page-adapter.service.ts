import { Injectable } from '@angular/core';

/**
 * @internal
 */
// TODO: Remove when dynamic component service is no longer optional in a future breaking change.
@Injectable({
  providedIn: 'root',
})
export class SkyWaitPageAdapterService {
  public addPageWaitEl(): void {
    document.body.appendChild(document.createElement('sky-wait-page'));
  }

  public removePageWaitEl(): void {
    const waitEl = document.querySelector('sky-wait-page');
    if (waitEl) {
      document.body.removeChild(waitEl);
    }
  }
}
