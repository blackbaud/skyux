import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkyHrefDemoComponent as HrefBasicSkyHrefDemoComponent } from '../code-examples/router/href/basic/sky-href-demo.component';
import { SkyHrefDemoModule as HrefBasicSkyHrefDemoModule } from '../code-examples/router/href/basic/sky-href-demo.module';

const routes: Routes = [
  { path: 'href/basic', component: HrefBasicSkyHrefDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RouterFeatureRoutingModule {}

@NgModule({
  imports: [
    HrefBasicSkyHrefDemoModule,
    HrefBasicSkyHrefDemoModule,
    RouterFeatureRoutingModule,
  ],
})
export class RouterFeatureModule {}
