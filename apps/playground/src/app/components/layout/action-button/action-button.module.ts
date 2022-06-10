import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyActionButtonModule } from '@skyux/layout';
import {
  SkyHref,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

import { ActionButtonRoutingModule } from './action-button-routing.module';
import { ActionButtonComponent } from './action-button.component';

const routes: Routes = [{ path: '', component: ActionButtonComponent }];

@NgModule({
  declarations: [ActionButtonComponent],
  imports: [
    CommonModule,
    ActionButtonRoutingModule,
    RouterModule.forChild(routes),
    SkyActionButtonModule,
  ],
  providers: [
    {
      provide: SkyHrefResolverService,
      useValue: {
        resolveHref: (args: SkyHrefResolverArgs) =>
          Promise.resolve<SkyHref>({
            url: args.url,
            userHasAccess: !args.url.startsWith('1bb-nav://nope/'),
          }),
      },
    },
  ],
})
export class ActionButtonModule {}
