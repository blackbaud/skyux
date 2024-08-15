import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
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

  @HostBinding('attr.aria-atomic')
  protected readonly ariaAtomic = 'true';

  @HostBinding('attr.aria-live')
  protected readonly ariaLive = 'assertive';

  @HostBinding('attr.aria-relevant')
  protected readonly ariaRelevant = 'all';
}
