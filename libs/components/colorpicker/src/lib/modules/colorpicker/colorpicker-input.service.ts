import { Injectable, OnDestroy } from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';

import { SkyColorpickerOutput } from './types/colorpicker-output';

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
  // Relays a touch signal from `SkyColorpickerComponent` (for example, when
  // the trigger button opens the picker dialog) to the bound
  // `SkyColorpickerInputDirective`, which re-emits it through its own
  // `touch` output, so touch handling works the same across all form
  // flavors.
  public touch = new Subject<void>();

  // Relays a color the user applied through the picker dialog's **Apply**
  // button to the bound `SkyColorpickerInputDirective`. The directive
  // treats this as a user-driven change: it writes the color through to
  // the bound field via `value.set()`, which marks the field dirty.
  // Contrast with `reset`, which reverts the display without touching the
  // field.
  public colorApplied = new Subject<SkyColorpickerOutput>();

  // Relays a programmatic reset (the `SkyColorpickerMessageType.Reset`
  // message) to the bound `SkyColorpickerInputDirective`. The directive
  // re-renders the display to match `initialColor` without calling
  // `value.set()`, so a reset triggered by a consumer (rather than the
  // reset button, which is a user action) doesn't mark the field dirty.
  public reset = new Subject<string | undefined>();

  public ngOnDestroy(): void {
    this.inputId.complete();
    this.labelText.complete();
    this.ariaError.complete();
    this.touch.complete();
    this.colorApplied.complete();
    this.reset.complete();
  }
}
