import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertDemoComponent as AlertBasicDemoComponent } from '../code-examples/indicators/alert/basic/alert-demo.component';
import { AlertDemoModule as AlertBasicDemoModule } from '../code-examples/indicators/alert/basic/alert-demo.module';
import { KeyInfoDemoComponent } from '../code-examples/indicators/key-info/basic/key-info-demo.component';
import { KeyInfoDemoModule } from '../code-examples/indicators/key-info/basic/key-info-demo.module';
import { LabelDemoComponent } from '../code-examples/indicators/label/basic/label-demo.component';
import { LabelDemoModule } from '../code-examples/indicators/label/basic/label-demo.module';
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
  {
    path: 'key-info/basic',
    component: KeyInfoDemoComponent,
  },
  {
    path: 'label/basic',
    component: LabelDemoComponent,
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
    KeyInfoDemoModule,
    LabelDemoModule,
  ],
})
export class IndicatorsFeatureModule {}
