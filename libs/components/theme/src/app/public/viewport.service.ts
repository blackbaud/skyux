import {
  Injectable
} from '@angular/core';

import { ReplaySubject } from 'rxjs/ReplaySubject';

/**
 * Provides information about the state of the application's viewport.
 */
@Injectable()
export class SkyAppViewportService {

  /**
   * Updated when the viewport becomes visible.  While the page is rendered, the
   * viewport may remain hidden as fonts and styles are loaded asynchronously;
   * this is done to avoid a FOUC (Flash Of Unstyled Content) before the fonts
   * and styles are ready.
   */
  public visible = new ReplaySubject<boolean>(1);

}
