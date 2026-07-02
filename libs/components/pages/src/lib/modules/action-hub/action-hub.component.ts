import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

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
  public readonly needsAttention = input<
    SkyActionHubNeedsAttentionInput | undefined
  >(undefined);

  /**
   * Links back to a parent page.
   */
  public readonly parentLink = input<SkyPageLink | undefined>();

  /**
   * The list of recently accessed links, or `"loading"` to display a wait indicator.
   * @default []
   */
  public readonly recentLinks = input<SkyRecentLinksInput>([]);

  /**
   * The list of related links, or `"loading"` to display a wait indicator.
   * @default []
   */
  public readonly relatedLinks = input<SkyPageLinksInput>([]);

  /**
   * The list of settings with modal parameters, or `"loading"` to display a wait indicator.
   * @default []
   */
  public readonly settingsLinks = input<SkyPageModalLinksInput>([]);

  /**
   * The page title.
   * @default ""
   */
  public readonly title = input('');

  protected readonly needsAttentionArray = computed(() => {
    const value = this.needsAttention();
    return Array.isArray(value) ? value : [];
  });
  protected readonly needsAttentionLoading = computed(
    () => this.needsAttention() === 'loading',
  );
  protected readonly needsAttentionNotDefinitelyEmpty = computed(
    () => this.needsAttentionLoading() || this.needsAttentionArray().length > 0,
  );
  protected readonly relatedLinksSorted = computed(() => {
    const value = this.relatedLinks();
    const links = Array.isArray(value) ? value.slice() : [];
    links.sort((a, b) => a.label.trim().localeCompare(b.label.trim()));
    return links;
  });
}
