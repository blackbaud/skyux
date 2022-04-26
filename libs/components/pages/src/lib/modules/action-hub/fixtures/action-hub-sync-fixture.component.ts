import { Component } from '@angular/core';

import { SkyLink } from '../../link-list/types/link';
import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'sky-action-hub-sync-fixture',
  templateUrl: 'action-hub-sync-fixture.component.html',
})
export class ActionHubSyncFixtureComponent {
  public title = 'Page title';
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading' = 'loading';
  public relatedLinks: SkyLink[] | 'loading' = 'loading';
  public recentLinks: SkyRecentLink[] | 'loading' | undefined = 'loading';
}
