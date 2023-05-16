import { Component, Input } from '@angular/core';

import { SkyPageLink } from '../action-hub/types/page-link';

let parentLink: SkyPageLink;

/**
 * Displays a page heading with optional content to display under
 * the heading.
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
  public parentLink?: typeof parentLink;

  /**
   * The title of the current page.
   */
  @Input()
  public pageTitle!: string;
}
