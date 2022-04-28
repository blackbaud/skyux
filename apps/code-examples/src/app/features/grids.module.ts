import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GridDemoComponent as GridBasicDemoComponent } from '../code-examples/grids/grid/basic/grid-demo.component';
import { GridDemoModule as GridBasicDemoModule } from '../code-examples/grids/grid/basic/grid-demo.module';

const routes: Routes = [
  {
    path: 'grid/basic',
    component: GridBasicDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GridsFeatureRoutingModule {}

@NgModule({
  imports: [GridsFeatureRoutingModule, GridBasicDemoModule],
})
export class GridsFeatureModule {}
