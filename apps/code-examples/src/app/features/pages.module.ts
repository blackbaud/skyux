import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionHubDemoComponent } from '../code-examples/pages/action-hub/action-hub-demo.component';
import { ActionHubDemoModule } from '../code-examples/pages/action-hub/action-hub-demo.module';

const routes: Routes = [
  { path: 'action-hub', component: ActionHubDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesFeatureRoutingModule {}

@NgModule({
  imports: [ActionHubDemoModule, PagesFeatureRoutingModule],
})
export class PagesFeatureModule {}
