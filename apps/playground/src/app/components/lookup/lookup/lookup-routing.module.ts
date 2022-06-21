import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LookupComponent } from './lookup.component';

const routes = [
  {
    path: '',
    component: LookupComponent,
    data: {
      name: 'Lookup',
      icon: 'search',
      library: 'lookup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LookupRoutingModule {
  public static routes = routes;
}
