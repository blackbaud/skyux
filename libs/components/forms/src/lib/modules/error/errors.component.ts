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

import { SkyFormErrorComponent } from './error.component';

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
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFormErrorsComponent {
  @HostBinding('attr.aria-live')
  protected readonly ariaLive = 'polite';

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
}
