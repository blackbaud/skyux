import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyAffixModule } from '@skyux/core';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';
import { LipsumModule } from '../../../shared/lipsum/lipsum.module';

import { AffixerComponent } from './affixer.component';
import { ModalComponent } from './modal/modal.component';

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
  declarations: [AffixerComponent, ModalComponent],
  imports: [
    CommonModule,
    SkyAffixModule,
    AffixerRoutingModule,
    SkyModalModule,
    LipsumModule,
    SkyDropdownModule,
  ],
})
export class AffixerModule {
  public static routes = AffixerRoutingModule.routes;
}
