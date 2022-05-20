import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlyoutVisualComponent } from './visual/flyout/flyout-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent,
  },
  {
    path: 'visual/flyout',
    component: FlyoutVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
