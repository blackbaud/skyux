import { Component, Input } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

import { SkyPageLink } from '../action-hub/types/page-link';

/**
 * Displays page heading's contents using spacing that corresponds to the parent page's layout
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: false,
})
export class SkyPageHeaderComponent {
  /**
   * A link to the parent page of the current page.
   */
  @Input()
  public parentLink: SkyPageLink | undefined;

  /**
   * The title of the current page.
   */
  @Input()
  public pageTitle: string | undefined;
}
