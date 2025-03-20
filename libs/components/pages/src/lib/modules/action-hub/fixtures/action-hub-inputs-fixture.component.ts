import { Component } from '@angular/core';
import { SkyActionHubModule } from '@skyux/pages';
import { provideHrefTesting } from '@skyux/router/testing';

import { SkyLink } from '../../link-list/types/link';
import { SkyActionHubNeedsAttention } from '../types/action-hub-needs-attention';
import { SkyRecentLink } from '../types/recent-link';

@Component({
  selector: 'sky-action-hub-inputs-fixture',
  templateUrl: 'action-hub-inputs-fixture.component.html',
  imports: [SkyActionHubModule],
  providers: [provideHrefTesting({ userHasAccess: true })],
})
export class ActionHubInputsFixtureComponent {
  public title: string | undefined;
  public parentLink: SkyLink | undefined;
  public recentLinks: SkyRecentLink[] | 'loading' | undefined;
  public relatedLinks: SkyLink[] | 'loading' | undefined;
  public needsAttention: SkyActionHubNeedsAttention[] | 'loading' | undefined;
  public loading: boolean | undefined;
}
