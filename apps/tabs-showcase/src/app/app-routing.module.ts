import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SectionedFormVisualComponent } from './visual/sectioned-form/sectioned-form-visual.component';
import { TabsVisualComponent } from './visual/tabs/tabs-visual.component';
import { VerticalTabsVisualComponent } from './visual/vertical-tabset/vertical-tabs-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent,
  },
  {
    path: 'visual/sectioned-form',
    component: SectionedFormVisualComponent,
  },
  {
    path: 'visual/tabs',
    component: TabsVisualComponent,
  },
  {
    path: 'visual/vertical-tabset',
    component: VerticalTabsVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
