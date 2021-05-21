import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyActionHubData } from './types/action-hub-data';
import { SkyActionHubNeedsAttention } from './types/action-hub-needs-attention';
import { SkyPageLink } from './types/page-link';
import { SkyRecentLink } from './types/recent-link';

/**
 * Creates an action hub to direct user attention to important
 * actions and provide quick access to common tasks.
 */
@Component({
  selector: 'sky-action-hub',
  templateUrl: './action-hub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyActionHubComponent {
  /**
   * Passes a SkyActionHubData object to build the action hub. The page loads until
   * `[data]` has a value.
   *
   * @param value
   */
  @Input()
  public set data(value: SkyActionHubData) {
    if (!value) {
      this.loading = true;
    } else {
      this.loading = false;
      this.needsAttention = value.needsAttention;
      this.parentLink = value.parentLink;
      this.recentLinks = SkyActionHubComponent.getRecentLinksSorted(
        value.recentLinks,
        5
      );
      this.relatedLinks = SkyActionHubComponent.getRelatedLinksSorted(
        value.relatedLinks
      );
      this.title = value.title;
    }
  }

  public needsAttention: SkyActionHubNeedsAttention[];

  public parentLink: SkyPageLink;

  public recentLinks: SkyRecentLink[];

  public relatedLinks: SkyPageLink[];

  public title = '';

  public loading: boolean = true;

  private static getRecentLinksSorted(
    recentLinks: SkyRecentLink[],
    limit: number
  ): SkyRecentLink[] {
    if (!recentLinks || recentLinks.length === 0) {
      return [];
    }
    return recentLinks
      .slice(0)
      .sort((a, b) => {
        const aTime =
          a.lastAccessed instanceof Date
            ? a.lastAccessed.toISOString()
            : a.lastAccessed;
        const bTime =
          b.lastAccessed instanceof Date
            ? b.lastAccessed.toISOString()
            : b.lastAccessed;
        if (aTime === bTime) {
          return 0;
        }
        return aTime > bTime ? -1 : 1;
      })
      .slice(0, limit);
  }

  private static getRelatedLinksSorted(
    relatedLinks: SkyPageLink[]
  ): SkyPageLink[] {
    if (!relatedLinks || relatedLinks.length === 0) {
      return [];
    }
    return relatedLinks.slice(0).sort((a, b) => {
      const aLabel = a.label.trim().toUpperCase();
      const bLabel = b.label.trim().toUpperCase();
      if (aLabel === bLabel) {
        return 0;
      }
      return aLabel < bLabel ? -1 : 1;
    });
  }
}
