import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TilesDemoComponent as TilesBasicDemoComponent } from '../code-examples/tiles/tiles/basic/tiles-demo.component';
import { TilesDemoModule as TilesBasicDemoModule } from '../code-examples/tiles/tiles/basic/tiles-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: TilesBasicDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TilesFeatureRoutingModule {}

@NgModule({
  imports: [TilesBasicDemoModule, TilesFeatureRoutingModule],
})
export class TilesFeatureModule {}
