import { Injectable } from '@angular/core';

import { ReplaySubject } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyColorpickerInputService {
  public inputId = new ReplaySubject<string>(1);
  public ariaError = new ReplaySubject<{ hasError: boolean; errorId: string }>(
    1,
  );
}
