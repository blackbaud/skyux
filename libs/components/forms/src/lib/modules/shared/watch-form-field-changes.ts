import { ChangeDetectorRef, effect } from '@angular/core';
import { FormField } from '@angular/forms/signals';

// Call from a component's constructor so `effect()` picks up the current injection context.
/**
 * Marks `changeDetector` for check whenever `formField`'s state changes, since a signal
 * write in the consumer's template doesn't automatically mark the host view for check.
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
