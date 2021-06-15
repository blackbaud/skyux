import { Component } from '@angular/core';

import { SkyLink } from '../../link-list/types/link';
import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'app-action-hub-inputs-fixture',
  templateUrl: 'action-hub-inputs-fixture.component.html'
})
export class ActionHubInputsFixtureComponent {
  public title: string;
  public parentLink: SkyLink;
  public recentLinks: SkyRecentLink[] | 'loading';
  public relatedLinks: SkyLink[] | 'loading';
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading';
  public loading: boolean;
}
