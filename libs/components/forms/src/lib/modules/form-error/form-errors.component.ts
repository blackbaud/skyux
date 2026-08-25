import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  booleanAttribute,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';

import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyFormErrorComponent } from './form-error.component';

// Angular signal-forms error kinds that have a dedicated block in this component's
// template; skipped by `customMessageErrors` so a consumer-supplied `message` doesn't
// render alongside the SKY message. SKY-owned error kinds (`skyDate`, `skyEmail`,
// `skyTime`, etc.) are deliberately absent — SKY validators never set `message`, so
// `customMessageErrors` already excludes them by construction.
/**
 * @internal
 */
export const SKY_HANDLED_SIGNAL_ERROR_KINDS = new Set([
  'required',
  'minLength',
  'maxLength',
  'email',
]);

/**
 * @internal
 */
@Component({
  selector: 'sky-form-errors',
  imports: [SkyIdModule, SkyFormErrorComponent, SkyFormsResourcesModule],
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFormErrorsComponent {
  /**
   * The validation errors from the form control.
   */
  @Input()
  public errors: ValidationErrors | null | undefined;

  /**
   * Input label text to display in the error messages.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Indicates whether the parent component's control is touched
   */
  @Input({ transform: booleanAttribute })
  public touched = false;

  /**
   * Indicates whether the parent component's control is dirty
   */
  @Input({ transform: booleanAttribute })
  public dirty = false;

  @HostBinding('attr.aria-atomic')
  protected readonly ariaAtomic = 'true';

  @HostBinding('attr.aria-live')
  protected readonly ariaLive = 'assertive';

  @HostBinding('attr.aria-relevant')
  protected readonly ariaRelevant = 'all';

  // Signal-forms validation errors (e.g. from a custom `validate()` rule) that aren't
  // mapped to a built-in SKY message; rendered automatically as custom errors when they
  // carry a `message`.
  protected get customMessageErrors(): { kind: string; message: string }[] {
    const errors = this.errors;

    if (!errors) {
      return [];
    }

    return Object.entries(errors)
      .filter(
        ([kind, error]) =>
          !SKY_HANDLED_SIGNAL_ERROR_KINDS.has(kind) &&
          typeof (error as { message?: unknown })?.message === 'string',
      )
      .map(([kind, error]) => ({
        kind,
        message: (error as { message: string }).message,
      }));
  }
}
