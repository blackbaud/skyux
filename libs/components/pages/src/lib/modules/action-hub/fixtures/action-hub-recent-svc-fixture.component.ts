import { Component } from '@angular/core';

import { SkyRecentLinksInput } from '../types/recent-links-input';

@Component({
  selector: 'sky-action-hub-recent-svc-fixture',
  templateUrl: 'action-hub-recent-svc-fixture.component.html',
  standalone: false,
})
export class ActionHubRecentSvcFixtureComponent {
  public recentLinks: SkyRecentLinksInput;
}
