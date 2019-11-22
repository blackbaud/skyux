import {
  Injectable
} from '@angular/core';

/**
 * @deprecated Use `SkyAppWindowRef` instead.
 */
@Injectable()
export class SkyWindowRefService {
  public getWindow(): Window {
    return window;
  }
}
