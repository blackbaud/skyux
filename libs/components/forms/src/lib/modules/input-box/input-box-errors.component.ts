import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyInputBoxErrorComponent } from './input-box-error.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-input-box-errors',
  standalone: true,
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIdModule,
    SkyInputBoxErrorComponent,
    SkyFormsResourcesModule,
  ],
  templateUrl: './input-box-errors.component.html',
  styleUrls: ['./input-box-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyInputBoxErrorsComponent {
  @Input()
  public errors: ValidationErrors | undefined;

  @Input()
  public labelText: string | undefined;
}
