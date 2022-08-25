import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyRecentLink } from '@skyux/pages';
import {
  SkyRecentlyAccessedGetLinksArgs,
  SkyRecentlyAccessedService,
} from '@skyux/router';

import { ActionHubPlaygroundRecentlyAccessedService } from './action-hub-recently-accessed.service';

@Component({
  selector: 'app-action-hub-recent-links',
  templateUrl: './action-hub-recent-links.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SkyRecentlyAccessedService,
      useClass: ActionHubPlaygroundRecentlyAccessedService,
    },
  ],
})
export class ActionHubPlaygroundRecentLinksComponent {
  public recentLinks:
    | SkyRecentLink[]
    | SkyRecentlyAccessedGetLinksArgs
    | undefined;

  public switchRecentLinks(appName?: string, links?: SkyRecentLink[]) {
    if (appName) {
      this.recentLinks = {
        requestedRoutes: [
          {
            app: appName,
            route: '/',
          },
        ],
      };
    } else {
      this.recentLinks = links;
    }
  }
}
