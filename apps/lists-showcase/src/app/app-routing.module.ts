import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterVisualComponent } from './visual/filter/filter-visual.component';
import { InfiniteScrollVisualComponent } from './visual/infinite-scroll/infinite-scroll-visual.component';
import { PagingVisualComponent } from './visual/paging/paging-visual.component';
import { RepeaterVisualComponent } from './visual/repeater/repeater-visual.component';
import { SortVisualComponent } from './visual/sort/sort-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent,
  },
  {
    path: 'visual/filter',
    component: FilterVisualComponent,
  },
  {
    path: 'visual/infinite-scroll',
    component: InfiniteScrollVisualComponent,
  },
  {
    path: 'visual/paging',
    component: PagingVisualComponent,
  },
  {
    path: 'visual/repeater',
    component: RepeaterVisualComponent,
  },
  {
    path: 'visual/sort',
    component: SortVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
