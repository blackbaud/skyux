import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  StacheGoogleAnalyticsDirective
} from './google-analytics.directive';

import {
  SkyAppConfig
} from '@skyux/config';

@NgModule({
  imports: [
    RouterModule
  ],
  providers: [
    SkyAppConfig
  ],
  declarations: [
    StacheGoogleAnalyticsDirective
  ],
  exports: [
    StacheGoogleAnalyticsDirective
  ]
})
export class StacheAnalyticsModule { }
