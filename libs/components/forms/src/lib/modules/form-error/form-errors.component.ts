import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';

import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyFormErrorComponent } from './form-error.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-form-errors',
  standalone: true,
  imports: [
    CommonModule,
    SkyIdModule,
    SkyFormErrorComponent,
    SkyFormsResourcesModule,
  ],
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFormErrorsComponent {
  @HostBinding('attr.aria-relevant')
  protected ariaRelevant: 'all' | undefined = 'all';

  @HostBinding('attr.role')
  protected role: 'alert' | undefined = 'alert';

  /**
   * The validation errors from the form control.
   */
  @Input({ transform: (value: unknown) => value || undefined })
  public errors: ValidationErrors | undefined;

  /**
   * Input label text to display in the error messages.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Indicates whether to show error messages, which might only be true if the
   * form control is touched or dirty.
   */
  @Input({ transform: coerceBooleanProperty })
  public showErrors = true;

  /**
   * Indicates whether error messages should be announced to screen readers by
   * this component when they are shown. Set to `false` if the error messages
   * are already announced, such as if a parent has `role="alert"` or `aria-live`.
   */
  @Input({ transform: coerceBooleanProperty })
  public set announceErrors(value: boolean) {
    this.ariaRelevant = value ? 'all' : undefined;
    this.role = value ? 'alert' : undefined;
  }
}
