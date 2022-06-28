import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertDemoComponent as AlertBasicDemoComponent } from '../code-examples/indicators/alert/basic/alert-demo.component';
import { AlertDemoModule as AlertBasicDemoModule } from '../code-examples/indicators/alert/basic/alert-demo.module';
import { StatusIndicatorDemoComponent } from '../code-examples/indicators/status-indicator/basic/status-indicator-demo.component';
import { StatusIndicatorDemoModule } from '../code-examples/indicators/status-indicator/basic/status-indicator-demo.module';

const routes: Routes = [
  {
    path: 'alert/basic',
    component: AlertBasicDemoComponent,
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
export class IndicatorsFeatureRoutingModule {}

@NgModule({
  imports: [
    IndicatorsFeatureRoutingModule,
    AlertBasicDemoModule,
    StatusIndicatorDemoModule,
  ],
})
export class IndicatorsFeatureModule {}
