import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { WizardDemoComponent } from './wizard-demo.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: WizardDemoComponent,
    data: {
      name: 'Wizard',
      icon: 'wand',
      library: 'tabs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class WizardRoutingModule {
  public static routes = routes;
}
