import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlyoutWithTabsIntegrationComponent } from '../integrations/flyout-with-tabs/basic/flyout-demo.component';
import { FlyoutWithTabsIntegrationModule } from '../integrations/flyout-with-tabs/basic/flyout-with-tabs.module';

const routes: Routes = [
  {
    path: 'basic',
    component: FlyoutWithTabsIntegrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlyoutWithTabsRoutingModule {}

@NgModule({
  imports: [FlyoutWithTabsIntegrationModule, FlyoutWithTabsRoutingModule],
})
export class FlyoutWithTabsModule {}
