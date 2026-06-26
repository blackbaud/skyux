import { Component, input } from '@angular/core';

import { SkyActionHubModule } from '../action-hub.module';
import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyPageLink } from '../types/page-link';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'sky-action-hub-sync-fixture',
  templateUrl: 'action-hub-sync-fixture.component.html',
  imports: [SkyActionHubModule],
})
export class ActionHubSyncFixtureComponent {
  public title = input<string>('Page title');
  public needsAttention = input<SkyActionHubNeedsAttention[] | 'loading'>('loading');
  public relatedLinks = input<SkyPageLink[] | 'loading'>('loading');
  public recentLinks = input<SkyRecentLink[] | 'loading' | undefined>('loading');
}
