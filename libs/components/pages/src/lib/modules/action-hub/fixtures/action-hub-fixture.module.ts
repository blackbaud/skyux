import { NgModule } from '@angular/core';

import { ActionHubAsyncFixtureComponent } from './action-hub-async-fixture.component';
import { ActionHubContentFixtureComponent } from './action-hub-content-fixture.component';
import { ActionHubInputsFixtureComponent } from './action-hub-inputs-fixture.component';
import { ActionHubRecentSvcFixtureComponent } from './action-hub-recent-svc-fixture.component';
import { ActionHubSyncFixtureComponent } from './action-hub-sync-fixture.component';

@NgModule({
  imports: [
    ActionHubAsyncFixtureComponent,
    ActionHubContentFixtureComponent,
    ActionHubInputsFixtureComponent,
    ActionHubRecentSvcFixtureComponent,
    ActionHubSyncFixtureComponent,
  ],
  exports: [
    ActionHubAsyncFixtureComponent,
    ActionHubContentFixtureComponent,
    ActionHubInputsFixtureComponent,
    ActionHubRecentSvcFixtureComponent,
    ActionHubSyncFixtureComponent,
  ],
})
export class SkyActionHubFixtureModule {}
