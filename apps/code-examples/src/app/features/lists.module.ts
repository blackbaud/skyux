import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterDemoComponent } from '../code-examples/lists/filter/inline/filter-demo.component';
import { FilterDemoModule } from '../code-examples/lists/filter/inline/filter-demo.module';
import { FilterDemoComponent as FilterModalComponent } from '../code-examples/lists/filter/modal/filter-demo.component';
import { FilterDemoModule as FilterModalModule } from '../code-examples/lists/filter/modal/filter-demo.module';
import { InfiniteScrollDemoComponent as InfiniteScrollRepeaterComponent } from '../code-examples/lists/infinite-scroll/repeater/infinite-scroll-demo.component';
import { InfiniteScrollDemoModule as InfiniteScrollRepeaterModule } from '../code-examples/lists/infinite-scroll/repeater/infinite-scroll-demo.module';
import { PagingDemoComponent } from '../code-examples/lists/paging/basic/paging-demo.component';
import { PagingDemoModule } from '../code-examples/lists/paging/basic/paging-demo.module';
import { RepeaterDemoComponent as RepeaterAddRemoveDemoComponent } from '../code-examples/lists/repeater/add-remove/repeater-demo.component';
import { RepeaterDemoModule as RepeaterAddRemoveDemoModule } from '../code-examples/lists/repeater/add-remove/repeater-demo.module';
import { RepeaterDemoComponent as RepeaterBasicDemoComponent } from '../code-examples/lists/repeater/basic/repeater-demo.component';
import { RepeaterDemoModule as RepeaterBasicDemoModule } from '../code-examples/lists/repeater/basic/repeater-demo.module';
import { RepeaterDemoComponent as RepeaterInlineFormDemoComponent } from '../code-examples/lists/repeater/inline-form/repeater-demo.component';
import { RepeaterDemoModule as RepeaterInlineFormDemoModule } from '../code-examples/lists/repeater/inline-form/repeater-demo.module';
import { SortDemoComponent } from '../code-examples/lists/sort/basic/sort-demo.component';
import { SortDemoModule } from '../code-examples/lists/sort/basic/sort-demo.module';

const routes: Routes = [
  {
    path: 'filter/inline',
    component: FilterDemoComponent,
  },
  {
    path: 'filter/modal',
    component: FilterModalComponent,
  },
  {
    path: 'infinite-scroll/repeater',
    component: InfiniteScrollRepeaterComponent,
  },
  {
    path: 'paging/basic',
    component: PagingDemoComponent,
  },
  {
    path: 'repeater/basic',
    component: RepeaterBasicDemoComponent,
  },
  {
    path: 'repeater/add-remove',
    component: RepeaterAddRemoveDemoComponent,
  },
  {
    path: 'repeater/inline-form',
    component: RepeaterInlineFormDemoComponent,
  },
  {
    path: 'sort/basic',
    component: SortDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsFeatureRoutingModule {}

@NgModule({
  imports: [
    ListsFeatureRoutingModule,
    RepeaterAddRemoveDemoModule,
    RepeaterBasicDemoModule,
    RepeaterInlineFormDemoModule,
    FilterDemoModule,
    FilterModalModule,
    InfiniteScrollRepeaterModule,
    PagingDemoModule,
    SortDemoModule,
  ],
})
export class ListsFeatureModule {}
