import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';

/**
 * Specifies the label to display beside the toggle switch. To display a help button beside the label, include a help
 * button element, such as `sky-help-inline`, in the `sky-toggle-switch` element and a `sky-control-help` CSS class on
 * that help button element.
 * @deprecated Use the `labelText` input on the toggle switch component instead.
 */
@Component({
  selector: 'sky-toggle-switch-label',
  templateUrl: './toggle-switch-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyToggleSwitchLabelComponent {
  constructor() {
    inject(SkyLogService).deprecated('SkyToggleSwitchLabelComponent', {
      deprecationMajorVersion: 9,
      replacementRecommendation:
        'To add a label to toggle switch, use the `labelText` input on the toggle switch component instead.',
    });
  }
}
