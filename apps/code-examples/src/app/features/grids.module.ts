import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GridDemoComponent as GridBasicDemoComponent } from '../code-examples/grids/grid/basic/grid-demo.component';
import { GridDemoModule as GridBasicDemoModule } from '../code-examples/grids/grid/basic/grid-demo.module';
import { GridDemoComponent as GridColumnTemplateDemoComponent } from '../code-examples/grids/grid/column-template/grid-demo.component';
import { GridDemoModule as GridColumnTemplateDemoModule } from '../code-examples/grids/grid/column-template/grid-demo.module';
import { GridDemoComponent as GridMultiselectDemoComponent } from '../code-examples/grids/grid/multiselect/grid-demo.component';
import { GridDemoModule as GridMultiselectDemoModule } from '../code-examples/grids/grid/multiselect/grid-demo.module';

const routes: Routes = [
  {
    path: 'grid/basic',
    component: GridBasicDemoComponent,
  },
  {
    path: 'grid/column-template',
    component: GridColumnTemplateDemoComponent,
  },
  {
    path: 'grid/multiselect',
    component: GridMultiselectDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GridsFeatureRoutingModule {}

@NgModule({
  imports: [
    GridsFeatureRoutingModule,
    GridBasicDemoModule,
    GridColumnTemplateDemoModule,
    GridMultiselectDemoModule,
  ],
})
export class GridsFeatureModule {}
