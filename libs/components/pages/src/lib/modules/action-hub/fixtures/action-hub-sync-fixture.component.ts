import { Component } from '@angular/core';

import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyPageLink } from '../types/page-link';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'sky-action-hub-sync-fixture',
  templateUrl: 'action-hub-sync-fixture.component.html',
})
export class ActionHubSyncFixtureComponent {
  public title = 'Page title';
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading' = 'loading';
  public relatedLinks: SkyPageLink[] | 'loading' = 'loading';
  public recentLinks: SkyRecentLink[] | 'loading' | undefined = 'loading';
}
