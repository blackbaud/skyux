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
   * Relays a touch signal from `SkyColorpickerComponent` (for example, when
   * the trigger button opens the picker dialog) to the bound
   * `SkyColorpickerInputDirective`, which re-emits it through its own `touch`
   * output. `Field`/`NgControl` listen to that output to mark the field
   * touched, so this works the same way across signal, reactive, and
   * template-driven forms.
   */
  public touch = new Subject<void>();

  public ngOnDestroy(): void {
    this.inputId.complete();
    this.labelText.complete();
    this.ariaError.complete();
    this.touch.complete();
  }
}
