import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkyProgressIndicatorPassiveDemoComponent } from '../code-examples/progress-indicator/passive-indicator/basic/progress-indicator-passive-demo.component';
import { SkyProgressIndicatorPassiveDemoModule } from '../code-examples/progress-indicator/passive-indicator/basic/progress-indicator-passive-demo.module';
import { SkyProgressIndicatorPassiveDemoComponent as ProgressIndicatorPassiveInlineHelpDemoComponent } from '../code-examples/progress-indicator/passive-indicator/inline-help/progress-indicator-passive-demo.component';
import { SkyProgressIndicatorPassiveDemoModule as ProgressIndicatorPassiveInlineHelpModule } from '../code-examples/progress-indicator/passive-indicator/inline-help/progress-indicator-passive-demo.module';
import { WaterfallIndicatorDocsComponent } from '../code-examples/progress-indicator/waterfall-indicator/basic/progress-indicator-waterfall-demo.component';
import { SkyProgressIndicatorPassiveDemoModule as SkyProgressIndicatorWaterfallDemoModule } from '../code-examples/progress-indicator/waterfall-indicator/basic/progress-indicator-waterfall-demo.module';
import { SkyProgressIndicatorPassiveDemoModule as SkyWizardDemoModule } from '../code-examples/progress-indicator/wizard/basic/wizard-demo.module';
import { WizardDemoComponent } from '../code-examples/tabs/wizard/basic/wizard-demo.component';

const routes: Routes = [
  { path: 'waterfall', component: WaterfallIndicatorDocsComponent },
  { path: 'passive', component: SkyProgressIndicatorPassiveDemoComponent },
  { path: 'wizard', component: WizardDemoComponent },
  {
    path: 'passive/inline-help',
    component: ProgressIndicatorPassiveInlineHelpDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgressIndicatorRoutingModule {}

@NgModule({
  imports: [
    SkyProgressIndicatorWaterfallDemoModule,
    SkyWizardDemoModule,
    SkyProgressIndicatorPassiveDemoModule,
    ProgressIndicatorPassiveInlineHelpModule,
    ProgressIndicatorRoutingModule,
  ],
})
export class ProgressIndicatorFeatureModule {}
