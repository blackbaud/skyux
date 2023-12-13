import { Component, HostBinding } from '@angular/core';
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
      class="sky-form-error-indicator sky-form-error"
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
      }
    `,
  ],
})
export class SkyFormErrorComponent {
  @HostBinding('class')
  protected cssClass = 'sky-form-error-indicator';
}
