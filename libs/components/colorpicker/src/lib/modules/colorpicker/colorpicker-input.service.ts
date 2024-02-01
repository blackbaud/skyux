import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyColorpickerInputService {
  public inputId = new ReplaySubject<string>(1);
  public labelText = new ReplaySubject<string | undefined>(1);
}
