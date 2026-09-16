import { Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';

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

  /**
   * Notifies the input directive that the colorpicker was reset to an
   * originally-empty value and its bound value should be cleared.
   */
  public clearValue = new Subject<void>();

  public ngOnDestroy(): void {
    this.inputId.complete();
    this.labelText.complete();
    this.ariaError.complete();
    this.clearValue.complete();
  }
}
