import { Component } from '@angular/core';

import { SkyActionHubModule } from '../action-hub.module';
import { SkyRecentLinksInput } from '../types/recent-links-input';

@Component({
  selector: 'sky-action-hub-recent-svc-fixture',
  templateUrl: 'action-hub-recent-svc-fixture.component.html',
  imports: [SkyActionHubModule],
})
export class ActionHubRecentSvcFixtureComponent {
  public recentLinks: SkyRecentLinksInput;
}
