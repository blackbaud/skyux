import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  inject,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { FORM_ERRORS } from './form-errors-token';

/**
 * @internal
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
      <ng-content />
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
  @Input()
  public set errorName(value: string) {
    this.#_errorName = value;
    this.#updateClasses();
  }

  public get errorName(): string {
    return this.#_errorName;
  }

  @HostBinding('class')
  protected cssClass = '';

  #_errorName = '';

  protected readonly formErrors = inject(FORM_ERRORS, { optional: true });
  readonly #changeDetector = inject(ChangeDetectorRef);

  #updateClasses(): void {
    this.cssClass = `sky-form-error-${this.errorName} sky-form-error-indicator`;
    this.#changeDetector.markForCheck();
  }
}
