import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyActionHubNeedsAttention, SkyRecentLink } from '@skyux/pages';
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
  standalone: false,
})
export class ActionHubPlaygroundRecentLinksComponent {
  public recentLinks:
    | SkyRecentLink[]
    | SkyRecentlyAccessedGetLinksArgs
    | undefined;
  public needsAttention: SkyActionHubNeedsAttention[] = [
    {
      title: 'Settings',
      permalink: {
        route: {
          commands: ['../settings'],
        },
      },
    },
    {
      title: 'Documentation',
      permalink: {
        route: {
          commands: ['../documentation'],
        },
      },
    },
  ];

  public switchRecentLinks(appName?: string, links?: SkyRecentLink[]): void {
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
