import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StacheGoogleAnalyticsDirective } from './google-analytics.directive';

@NgModule({
  imports: [RouterModule],
  declarations: [StacheGoogleAnalyticsDirective],
  exports: [StacheGoogleAnalyticsDirective],
})
export class StacheAnalyticsModule {}
