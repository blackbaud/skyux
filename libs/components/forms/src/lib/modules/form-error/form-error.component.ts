import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SKY_FORM_ERRORS_ENABLED } from './form-errors-enabled-token';

/**
 * Displays default and custom form field error messages for form field components.
 * Set `labelText` on the form field component to automatically display required,
 * maximum length, minimum length, date, email, phone number, time, and URL errors.
 * To display custom errors, include sky-form-error elements in the form field component.
 */
@Component({
  selector: 'sky-form-error',
  standalone: true,
  imports: [SkyStatusIndicatorModule, CommonModule],
  template: `
    <sky-status-indicator
      *ngIf="formErrors"
      class="sky-form-error"
      descriptionType="error"
      indicatorType="danger"
    >
      {{ errorText }}
    </sky-status-indicator>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: var(--sky-margin-stacked-xs);
      }
    `,
  ],
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
