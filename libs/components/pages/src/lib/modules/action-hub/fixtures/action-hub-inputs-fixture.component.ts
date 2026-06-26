import { Component, input } from '@angular/core';

import { SkyLink } from '../../link-list/types/link';
import { SkyActionHubModule } from '../action-hub.module';
import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'sky-action-hub-inputs-fixture',
  templateUrl: 'action-hub-inputs-fixture.component.html',
  imports: [SkyActionHubModule],
})
export class ActionHubInputsFixtureComponent {
  public title = input<string | undefined>(undefined);
  public parentLink = input<SkyLink | undefined>(undefined);
  public recentLinks = input<SkyRecentLink[] | 'loading' | undefined>(undefined);
  public relatedLinks = input<SkyLink[] | 'loading' | undefined>(undefined);
  public needsAttention = input<SkyActionHubNeedsAttention[] | 'loading' | undefined>(undefined);
  public loading = input<boolean | undefined>(undefined);
}
