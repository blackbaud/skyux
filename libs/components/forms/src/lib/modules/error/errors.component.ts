import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyErrorComponent } from './error.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-errors',
  standalone: true,
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIdModule,
    SkyErrorComponent,
    SkyFormsResourcesModule,
  ],
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyErrorsComponent {
  @HostBinding('attr.aria-live')
  public readonly ariaLive = 'polite';

  @Input()
  public errors: ValidationErrors | undefined;

  @Input()
  public labelText: string | undefined;
}
