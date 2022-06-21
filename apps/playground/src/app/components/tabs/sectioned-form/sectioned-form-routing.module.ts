import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SectionedFormComponent } from './sectioned-form.component';

const routes = [
  {
    path: '',
    component: SectionedFormComponent,
    data: {
      name: 'Sectioned form',
      icon: 'object-group',
      library: 'tabs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SectionedFormRoutingModule {
  public static routes = routes;
}
