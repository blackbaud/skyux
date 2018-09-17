import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyWaitPageAdapterService {

  public addPageWaitEl() {
    document.body.appendChild(document.createElement('sky-wait-page'));
  }

  public removePageWaitEl() {
    document.body.removeChild(document.querySelector('sky-wait-page'));
  }
}
