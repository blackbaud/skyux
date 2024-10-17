import { Component, Input } from '@angular/core';

import { SkyPageLink } from '../action-hub/types/page-link';

/**
 * Displays page heading's contents using spacing that corresponds to the parent page's layout
 */
@Component({
  selector: 'sky-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class SkyPageHeaderComponent {
  /**
   * A link to the parent page of the current page.
   */
  @Input()
  public parentLink?: SkyPageLink;

  /**
   * The title of the current page.
   */
  @Input()
  public pageTitle?: string;
}
