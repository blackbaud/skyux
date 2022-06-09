import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SkyHref,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';

import { SkyActionButtonModule } from '../action-button.module';

import { ActionButtonNgforTestComponent } from './action-button-ngfor.component.fixture';
import { ActionButtonTestComponent } from './action-button.component.fixture';

@NgModule({
  declarations: [ActionButtonTestComponent, ActionButtonNgforTestComponent],
  imports: [CommonModule, RouterTestingModule, SkyActionButtonModule],
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
export class SkyActionButtonFixturesModule {}
