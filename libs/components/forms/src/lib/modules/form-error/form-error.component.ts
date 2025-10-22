import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  inject,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { SKY_FORM_ERRORS_ENABLED } from './form-errors-enabled-token';

/**
 * Displays default and custom form field error messages for form field components.
 * Set `labelText` on the `SkyInputBoxComponent` to automatically display required,
 * maximum length, minimum length, date, email, phone number, time, and URL errors.
 * To display custom errors, include `sky-form-error` elements in the `SkyInputBoxComponent`.
 */
@Component({
  selector: 'sky-form-error',
  imports: [SkyStatusIndicatorModule],
  template: `
    @if (formErrors) {
      <sky-status-indicator
        class="sky-form-error"
        descriptionType="error"
        indicatorType="danger"
      >
        {{ errorText }}
      </sky-status-indicator>
    }
  `,
  styleUrl: './form-error.component.scss',
  hostDirectives: [SkyThemeComponentClassDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFormErrorComponent {
  /**
   * The name of the error.
   * @required
   */
  @Input({ required: true })
  public errorName!: string;

  /**
   * The error message to display.
   * @required
   */
  @Input({ required: true })
  public errorText!: string;

  @HostBinding('attr.data-error-name') public get dataErrorName(): string {
    return this.errorName;
  }

  protected readonly formErrors = inject(SKY_FORM_ERRORS_ENABLED, {
    optional: true,
  });

  constructor() {
    if (!this.formErrors) {
      throw new Error(
        'The `sky-form-error` component is not supported in the provided context.',
      );
    }
  }
}
