import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyHrefTestingModule } from '@skyux/router/testing';

import { SkyActionHubModule } from '../action-hub.module';

import { ActionHubAsyncFixtureComponent } from './action-hub-async-fixture.component';
import { ActionHubContentFixtureComponent } from './action-hub-content-fixture.component';
import { ActionHubInputsFixtureComponent } from './action-hub-inputs-fixture.component';
import { ActionHubRecentSvcFixtureComponent } from './action-hub-recent-svc-fixture.component';
import { ActionHubSyncFixtureComponent } from './action-hub-sync-fixture.component';

@NgModule({
  imports: [
    CommonModule,
    SkyActionHubModule,
    SkyKeyInfoModule,
    SkyHrefTestingModule.with({ userHasAccess: true }),
  ],
  declarations: [
    ActionHubAsyncFixtureComponent,
    ActionHubContentFixtureComponent,
    ActionHubInputsFixtureComponent,
    ActionHubRecentSvcFixtureComponent,
    ActionHubSyncFixtureComponent,
  ],
})
export class SkyActionHubFixtureModule {}
