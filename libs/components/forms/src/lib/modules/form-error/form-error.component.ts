import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @internal
 */
@Component({
  selector: 'sky-form-error',
  standalone: true,
  imports: [SkyStatusIndicatorModule],
  template: `
    <sky-status-indicator
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
  @HostBinding('class')
  protected readonly cssClass = 'sky-form-error-indicator';
}
