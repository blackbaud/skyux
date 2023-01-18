import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxDemoComponent } from '../code-examples/theme/box/basic/box-demo.component';
import { BoxDemoModule } from '../code-examples/theme/box/basic/box-demo.module';
import { StatusIndicatorDemoComponent } from '../code-examples/theme/status-indicator/basic/status-indicator-demo.component';
import { StatusIndicatorDemoModule } from '../code-examples/theme/status-indicator/basic/status-indicator-demo.module';

const routes: Routes = [
  {
    path: 'box/basic',
    component: BoxDemoComponent,
  },
  {
    path: 'status-indicator/basic',
    component: StatusIndicatorDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemesRoutingModule {}

@NgModule({
  imports: [ThemesRoutingModule, StatusIndicatorDemoModule, BoxDemoModule],
})
export class ThemesFeatureModule {}
