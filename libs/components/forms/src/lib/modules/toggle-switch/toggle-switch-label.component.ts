import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies the label to display beside the toggle switch.
 */
@Component({
  selector: 'sky-toggle-switch-label',
  templateUrl: './toggle-switch-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyToggleSwitchLabelComponent {}
