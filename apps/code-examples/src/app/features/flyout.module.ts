import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlyoutDemoComponent } from '../code-examples/flyout/flyout/basic/flyout-demo.component';
import { FlyoutDemoModule } from '../code-examples/flyout/flyout/basic/flyout-demo.module';
import { FlyoutDemoComponent as FlyoutCustomDemoComponent } from '../code-examples/flyout/flyout/custom-headers/flyout-demo.component';
import { FlyoutDemoModule as FlyoutCustomDemoModule } from '../code-examples/flyout/flyout/custom-headers/flyout-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: FlyoutDemoComponent,
  },
  {
    path: 'custom-headers',
    component: FlyoutCustomDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlyoutRoutingModule {}

@NgModule({
  imports: [FlyoutRoutingModule, FlyoutDemoModule, FlyoutCustomDemoModule],
})
export class FlyoutFeatureModule {}
