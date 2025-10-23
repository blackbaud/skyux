import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';

/**
 * Specifies a label to display in smaller text under or beside the value.
 * To display a help button beside the label, include a help button element, such as `sky-help-inline`,
 * in the `sky-key-info` element and a `sky-control-help` CSS class on that help button element.
 * @required
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyTrimModule],
  selector: 'sky-key-info-label',
  template: '<span skyTrim><ng-content /></span>',
})
export class SkyKeyInfoLabelComponent {}
