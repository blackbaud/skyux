import { Component, HostBinding } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @internal
 */
@Component({
  selector: 'sky-input-box-error',
  standalone: true,
  imports: [SkyStatusIndicatorModule],
  template: `<sky-status-indicator
    class="sky-error-indicator sky-input-box-error"
    descriptionType="error"
    indicatorType="danger"
  >
    <ng-content />
  </sky-status-indicator>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SkyInputBoxErrorComponent {
  @HostBinding('class')
  protected cssClass = 'sky-error-indicator';
}
