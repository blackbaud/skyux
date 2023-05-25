import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyAffixModule } from '@skyux/core';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { AffixerComponent } from './affixer.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: AffixerComponent,
    data: {
      name: 'Affixer',
      icon: 'plus-circle',
      library: 'core',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AffixerRoutingModule {
  public static routes = routes;
}
@NgModule({
  declarations: [AffixerComponent],
  imports: [CommonModule, SkyAffixModule, AffixerRoutingModule],
})
export class AffixerModule {
  public static routes = AffixerRoutingModule.routes;
}
