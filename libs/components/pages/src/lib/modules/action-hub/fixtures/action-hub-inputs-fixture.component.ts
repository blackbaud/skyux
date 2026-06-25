import { Component } from '@angular/core';

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
  public title: string | undefined;
  public parentLink: SkyLink | undefined;
  public recentLinks: SkyRecentLink[] | 'loading' | undefined;
  public relatedLinks: SkyLink[] | 'loading' | undefined;
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading' | undefined;
  public loading: boolean | undefined;
}
