import { Component, input } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyActionHubRecentLinksResolvePipe } from '../action-hub/action-hub-recent-links-resolve.pipe';
import { SkyRecentLinksInput } from '../action-hub/types/recent-links-input';
import { SkyLinkListComponent } from '../link-list/link-list.component';

@Component({
  selector: 'sky-link-list-recently-accessed',
  standalone: true,
  imports: [
    SkyActionHubRecentLinksResolvePipe,
    SkyI18nModule,
    SkyLinkListComponent,
  ],
  template: `
    <sky-link-list
      [links]="recentLinks() | skyActionHubRecentLinksResolve"
      [headingText]="'sky_action_hub_recent_links' | skyLibResources"
    />
  `,
})
export class SkyLinkListRecentlyAccessedComponent {
  public readonly recentLinks = input<SkyRecentLinksInput>();
}
