import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyActionHubNeedsAttention } from './types/action-hub-needs-attention';
import { SkyPageLink } from './types/page-link';
import { SkyPageLinksInput } from './types/page-links-input';
import { SkyRecentLinksInput } from './types/recent-links-input';

/**
 * Creates an action hub to direct user attention to important
 * actions and provide quick access to common tasks.
 */
@Component({
  selector: 'sky-action-hub',
  templateUrl: './action-hub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyActionHubComponent {
  /**
   * Provides a list of actions that users must perform based on business requirements or best practices, or `"loading"` to display a wait indicator.
   */
  @Input()
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading' = [];

  /**
   * Links back to a parent page.
   */
  @Input()
  public parentLink: SkyPageLink;

  /**
   * Provides a list of recently accessed links, or `"loading"` to display a wait indicator.
   */
  @Input()
  public recentLinks: SkyRecentLinksInput = [];

  /**
   * Provides a list of related links, or `"loading"` to display a wait indicator.
   */
  @Input()
  public relatedLinks: SkyPageLinksInput = [];

  /**
   * Specifies the page title.
   * @default ""
   */
  @Input()
  public title = '';
}
