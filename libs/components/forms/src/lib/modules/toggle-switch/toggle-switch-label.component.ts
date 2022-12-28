import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The label to display beside the toggle switch. To display a help button beside the label, include a help
 * button element, such as `sky-help-inline`, in the `sky-toggle-switch` element and a `sky-control-help` CSS class on
 * that help button element.
 */
@Component({
  selector: 'sky-toggle-switch-label',
  templateUrl: './toggle-switch-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyToggleSwitchLabelComponent {}
