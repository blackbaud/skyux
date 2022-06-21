import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SkipLinkComponent } from './skip-link.component';

const routes: Route[] = [
  {
    path: '',
    component: SkipLinkComponent,
    data: {
      name: 'Skip link',
      library: 'a11y',
      icon: 'universal-access',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SkipLinkRoutingModule {
  public static routes = routes;
}
