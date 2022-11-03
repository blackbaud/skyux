import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlyoutDemoComponent } from '../code-examples/flyout/flyout/basic/flyout-demo.component';
import { FlyoutDemoModule } from '../code-examples/flyout/flyout/basic/flyout-demo.module';
import { FlyoutDemoComponent as FlyoutCustomDemoComponent } from '../code-examples/flyout/flyout/custom-headers/flyout-demo.component';
import { FlyoutDemoModule as FlyoutCustomDemoModule } from '../code-examples/flyout/flyout/custom-headers/flyout-demo.module';

// TODO: add story for grid
// import { FlyoutDemoComponent as FlyoutGridDemoComponent } from '../code-examples/flyout/flyout/grid/flyout-demo.component';
// import { FlyoutDemoModule as FlyoutGridDemoModule } from '../code-examples/flyout/flyout/grid/flyout-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: FlyoutDemoComponent,
  },
  {
    path: 'custom-headers',
    component: FlyoutCustomDemoComponent,
  },
  // {
  //   path: 'grid',
  //   component: FlyoutGridDemoComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlyoutRoutingModule {}

@NgModule({
  imports: [
    FlyoutRoutingModule,
    FlyoutDemoModule,
    FlyoutCustomDemoModule,
    // FlyoutGridDemoModule,
  ],
})
export class FlyoutFeatureModule {}
