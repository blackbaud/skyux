import { Component } from '@angular/core';
import { SkyActionHubModule } from '@skyux/pages';
import { provideHrefTesting } from '@skyux/router/testing';

import { SkyRecentLinksInput } from '../types/recent-links-input';

@Component({
  selector: 'sky-action-hub-recent-svc-fixture',
  templateUrl: 'action-hub-recent-svc-fixture.component.html',
  imports: [SkyActionHubModule],
  providers: [provideHrefTesting({ userHasAccess: true })],
})
export class ActionHubRecentSvcFixtureComponent {
  public recentLinks: SkyRecentLinksInput;
}
