import { Component, input } from '@angular/core';

import { SkyActionHubRecentLinksResolvePipe } from '../action-hub/action-hub-recent-links-resolve.pipe';
import { SkyRecentLinksInput } from '../action-hub/types/recent-links-input';
import { SkyLinkListComponent } from '../link-list/link-list.component';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

/**
 * A component that displays a list of recently accessed links, such as within a `<sky-page-links>` component.
 */
@Component({
  selector: 'sky-link-list-recently-accessed',
  imports: [
    SkyActionHubRecentLinksResolvePipe,
    SkyLinkListComponent,
    SkyPagesResourcesModule,
  ],
  template: `
    <sky-link-list
      [links]="recentLinks() | skyActionHubRecentLinksResolve"
      [headingText]="'sky_action_hub_recent_links' | skyLibResources"
    />
  `,
})
export class SkyLinkListRecentlyAccessedComponent {
  /**
   * Option to pass links as an array of `SkyRecentLink` objects,
   * a `SkyRecentlyAccessedGetLinksArgs` object for `SkyRecentlyAccessedService`,
   * or `'loading'` to display a loading indicator.
   */
  public readonly recentLinks = input<SkyRecentLinksInput>();
}
