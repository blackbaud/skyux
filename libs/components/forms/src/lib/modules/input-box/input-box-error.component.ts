import { Component } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @internal
 */
@Component({
  selector: 'sky-input-box-error',
  standalone: true,
  imports: [SkyStatusIndicatorModule],
  template: `<sky-status-indicator
    class="sky-error-indicator"
    descriptionType="error"
    indicatorType="danger"
  >
    <ng-content />
  </sky-status-indicator>`,
})
export class SkyInputBoxErrorComponent {}
