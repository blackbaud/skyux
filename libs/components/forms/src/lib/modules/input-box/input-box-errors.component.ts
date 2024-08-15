import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyFormErrorModule } from '../form-error/form-error.module';
import { SKY_FORM_ERRORS_ENABLED } from '../form-error/form-errors-enabled-token';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';

/**
 * Input box errors
 * @internal
 */
@Component({
  selector: 'sky-input-box-errors',
  standalone: true,
  imports: [
    CommonModule,
    SkyFormErrorModule,
    SkyFormErrorsModule,
    SkyI18nModule,
  ],
  templateUrl: './input-box-errors.component.html',
  providers: [
    {
      provide: SKY_FORM_ERRORS_ENABLED,
      useValue: true,
    },
  ],
})
export class SkyInputBoxErrorsComponent {
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
   * Whether the input box is touched
   */
  @Input({ transform: booleanAttribute })
  public touched = false;

  /**
   * Whether the input box is dirty
   */
  @Input({ transform: booleanAttribute })
  public dirty = false;

  /**
   * Whether the input box is dirty
   */
  @Input({ transform: booleanAttribute })
  public errorsScreenReaderOnly = false;

  /**
   * Whether the input box is dirty
   */
  @Input()
  public errorId: string | undefined;
}
