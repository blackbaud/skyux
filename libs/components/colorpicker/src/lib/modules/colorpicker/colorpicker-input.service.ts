import { Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyColorpickerInputService implements OnDestroy {
  public inputId = new ReplaySubject<string>(1);
  public labelText = new ReplaySubject<string | undefined>(1);
  public ariaError = new ReplaySubject<{ hasError: boolean; errorId: string }>(
    1,
  );

  public ngOnDestroy(): void {
    this.inputId.complete();
    this.labelText.complete();
    this.ariaError.complete();
  }
}
