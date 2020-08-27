import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyWaitPageAdapterService {

  public addPageWaitEl(): void {
    document.body.appendChild(document.createElement('sky-wait-page'));
  }

  public removePageWaitEl(): void {
    document.body.removeChild(document.querySelector('sky-wait-page'));
  }
}
