import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterBarComponent } from './filter-bar.component';

const routes: Routes = [
  {
    path: '',
    component: FilterBarComponent,
    data: {
      name: 'FilterBar',
      icon: 'person',
      library: 'filter-bar',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilterBarRoutingModule {
  public static routes = routes;
}
