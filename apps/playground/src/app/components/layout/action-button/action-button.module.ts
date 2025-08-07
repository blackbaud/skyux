import { NgModule } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';
import {
  SkyHref,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

import { ActionButtonRoutingModule } from './action-button-routing.module';
import { ActionButtonComponent } from './action-button.component';

@NgModule({
  declarations: [ActionButtonComponent],
  imports: [ActionButtonRoutingModule, SkyActionButtonModule],
  providers: [
    {
      provide: SkyHrefResolverService,
      useValue: {
        resolveHref: (args: SkyHrefResolverArgs): Promise<SkyHref> =>
          Promise.resolve<SkyHref>({
            url: args.url,
            userHasAccess: !args.url.startsWith('1bb-nav://nope/'),
          }),
      },
    },
  ],
})
export class ActionButtonModule {
  public static routes = ActionButtonRoutingModule.routes;
}
