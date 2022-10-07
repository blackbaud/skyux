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
import { TextHighlightDemoComponent } from '../code-examples/indicators/text-highlight/basic/text-highlight-demo.component';
import { TextHighlightDemoModule } from '../code-examples/indicators/text-highlight/basic/text-highlight-demo.module';
import { TokensDemoComponent as TokensBasicDemoComponent } from '../code-examples/indicators/tokens/basic/tokens-demo.component';
import { TokensDemoModule as TokensBasicDemoModule } from '../code-examples/indicators/tokens/basic/tokens-demo.module';
import { TokensDemoComponent as TokensCustomDemoComponent } from '../code-examples/indicators/tokens/custom/tokens-demo.component';
import { TokensDemoModule as TokensCustomDemoModule } from '../code-examples/indicators/tokens/custom/tokens-demo.module';

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
  {
    path: 'text-highlight/basic',
    component: TextHighlightDemoComponent,
  },
  {
    path: 'tokens/basic',
    component: TokensBasicDemoComponent,
  },
  {
    path: 'tokens/custom',
    component: TokensCustomDemoComponent,
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
    TextHighlightDemoModule,
    TokensBasicDemoModule,
    TokensCustomDemoModule,
  ],
})
export class IndicatorsFeatureModule {}
