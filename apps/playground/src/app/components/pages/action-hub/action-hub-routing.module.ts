import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';

const routes: Routes = [
  {
    path: 'recent',
    component: ActionHubPlaygroundRecentLinksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionHubRoutingModule {}
