import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAlertModule } from '@skyux/indicators';
import {
  SkyHref,
  SkyHrefModule,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

import { AlertComponent } from './alert.component';

const routes: Routes = [{ path: '', component: AlertComponent }];
@NgModule({
  declarations: [AlertComponent],
  exports: [AlertComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAlertModule,
    SkyHrefModule,
  ],
  providers: [
    {
      provide: SkyHrefResolverService,
      useValue: {
        resolveHref: (args: SkyHrefResolverArgs): Promise<SkyHref> =>
          Promise.resolve<SkyHref>({
            url: args.url.replace('allow://', 'https://'),
            userHasAccess: !args.url.startsWith('deny://'),
          }),
      },
    },
  ],
})
export class AlertModule {}
