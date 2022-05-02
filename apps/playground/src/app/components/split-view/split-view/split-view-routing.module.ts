import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SplitViewComponent } from './basic/split-view.component';
import { SplitViewPageBoundComponent } from './page-bound/split-view-page-bound.compoennt';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SplitViewComponent,
      },
      {
        path: 'page-bound',
        component: SplitViewPageBoundComponent,
      },
    ]),
  ],
})
export class SplitViewRoutingModule {}
