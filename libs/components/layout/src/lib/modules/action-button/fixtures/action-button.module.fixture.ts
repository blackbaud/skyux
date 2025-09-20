import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SkyHref,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

import { SkyActionButtonModule } from '../action-button.module';

import { ActionButtonLinksComponent } from './action-button-links.component';
import { ActionButtonNgforTestComponent } from './action-button-ngfor.component.fixture';
import { ActionButtonTestComponent } from './action-button.component.fixture';

@NgModule({
  declarations: [
    ActionButtonTestComponent,
    ActionButtonNgforTestComponent,
    ActionButtonLinksComponent,
  ],
  imports: [RouterTestingModule, SkyActionButtonModule],
  providers: [
    {
      provide: SkyHrefResolverService,
      useValue: {
        resolveHref: (args: SkyHrefResolverArgs) => {
          if (args.url.startsWith('delayed://')) {
            return new Promise((resolve) => {
              setTimeout(resolve, 100, {
                url: args.url,
                userHasAccess: !args.url.includes('://nope/'),
              });
            });
          }
          return Promise.resolve<SkyHref>({
            url: args.url,
            userHasAccess: !args.url.startsWith('1bb-nav://nope/'),
          });
        },
      },
    },
  ],
})
export class SkyActionButtonFixturesModule {}
