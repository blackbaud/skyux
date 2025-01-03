import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

/**
 * Displays page contents using spacing that corresponds to the parent
 * page's layout.
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-page-content',
  template: `<ng-content />`,
  styleUrls: ['./page-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyPageContentComponent {}
