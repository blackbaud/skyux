import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyActionHubNeedsAttention } from './types/action-hub-needs-attention';
import { SkyActionHubNeedsAttentionInput } from './types/action-hub-needs-attention-input';
import { SkyPageLink } from './types/page-link';
import { SkyPageLinksInput } from './types/page-links-input';
import { SkyPageModalLinksInput } from './types/page-modal-links-input';
import { SkyRecentLinksInput } from './types/recent-links-input';

/**
 * Creates an action hub to direct user attention to important
 * actions and provide quick access to common tasks.
 */
@Component({
  selector: 'sky-action-hub',
  templateUrl: './action-hub.component.html',
  styleUrls: ['./action-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyActionHubComponent {
  /**
   * The list of actions that users must perform based on business requirements or best practices, or `"loading"` to display a wait indicator.
   */
  @Input()
  public set needsAttention(
    value: SkyActionHubNeedsAttentionInput | undefined,
  ) {
    this.#_needsAttention = value;
    this.needsAttentionArray = Array.isArray(value) ? value : [];
  }

  public get needsAttention(): SkyActionHubNeedsAttentionInput | undefined {
    return this.#_needsAttention;
  }

  /**
   * Links back to a parent page.
   */
  @Input()
  public parentLink: SkyPageLink | undefined;

  /**
   * The list of recently accessed links, or `"loading"` to display a wait indicator.
   */
  @Input()
  public recentLinks: SkyRecentLinksInput = [];

  /**
   * The list of related links, or `"loading"` to display a wait indicator.
   */
  @Input()
  public relatedLinks: SkyPageLinksInput = [];

  /**
   * The list of settings with modal parameters, or `"loading"` to display a wait indicator.
   */
  @Input()
  public settingsLinks: SkyPageModalLinksInput = [];

  /**
   * The page title.
   * @default ""
   */
  @Input()
  public title = '';

  public needsAttentionArray: SkyActionHubNeedsAttention[] = [];

  #_needsAttention: SkyActionHubNeedsAttentionInput | undefined;
}
