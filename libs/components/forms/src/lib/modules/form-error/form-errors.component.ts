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
}
