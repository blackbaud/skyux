import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyThemeService } from '@skyux/theme';

import { ActionHubVisualComponent } from './visual/action-hub/action-hub-visual.component';
import { PageHeaderVisualComponent } from './visual/page-header/page-header-visual.component';

const routes: Routes = [
  {
    path: 'visual/action-hub',
    component: ActionHubVisualComponent,
  },
  {
    path: 'visual/page-header',
    component: PageHeaderVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [SkyThemeService],
})
export class AppRoutingModule {}
