import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TilesDemoComponent as TilesBasicDemoComponent } from '../code-examples/tiles/tiles/basic/tiles-demo.component';
import { TilesDemoModule as TilesBasicDemoModule } from '../code-examples/tiles/tiles/basic/tiles-demo.module';
import { TilesDemoComponent as TilesInlineHelpDemoComponent } from '../code-examples/tiles/tiles/inline-help/tiles-demo.component';
import { TilesDemoModule as TilesInlineHelpDemoModule } from '../code-examples/tiles/tiles/inline-help/tiles-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: TilesBasicDemoComponent,
  },
  {
    path: 'inline-help',
    component: TilesInlineHelpDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TilesFeatureRoutingModule {}

@NgModule({
  imports: [
    TilesBasicDemoModule,
    TilesInlineHelpDemoModule,
    TilesFeatureRoutingModule,
  ],
})
export class TilesFeatureModule {}
