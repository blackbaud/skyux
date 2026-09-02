import { ChangeDetectorRef, effect } from '@angular/core';
import { FormField } from '@angular/forms/signals';

/**
 * Marks `changeDetector` for check whenever `formField`'s state changes, since a signal
 * write in the consumer's template doesn't automatically mark the host view for check.
 * Must be called from a component's constructor (or another injection context) so the
 * `effect()` it creates can pick one up; calling it elsewhere throws `NG0203`.
 * @internal
 */
export function skyWatchFormFieldChanges(
  formField: () => FormField<unknown> | null | undefined,
  changeDetector: ChangeDetectorRef,
  readAdditionalSignals?: (
    state: ReturnType<FormField<unknown>['state']>,
  ) => void,
): void {
  effect(() => {
    const field = formField();

    if (!field) {
      return;
    }

    const state = field.state();

    state.errors();
    state.touched();
    state.dirty();
    state.disabled();
    state.required();

    readAdditionalSignals?.(state);

    changeDetector.markForCheck();
  });
}
