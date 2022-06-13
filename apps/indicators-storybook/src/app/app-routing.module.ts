import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertVisualComponent } from './visual/alert/alert-visual.component';
import { SkyChevronDemoComponent } from './visual/chevron/chevron-demo.component';
import { SkyHelpInlineDemoComponent } from './visual/help-inline/help-inline-demo.component';
import { SkyIconStackDemoComponent } from './visual/icon-stack/icon-stack-demo.component';
import { SkyIconDemoComponent } from './visual/icon/icon-demo.component';
import { KeyInfoVisualComponent } from './visual/key-info/key-info-visual.component';
import { SkyLabelDemoComponent } from './visual/label/label-demo.component';
import { StatusIndicatorVisualComponent } from './visual/status-indicator/status-indicator-visual.component';
import { SkyTextHighlightDemoComponent } from './visual/text-highlight/text-highlight-demo.component';
import { SkyTokensDemoComponent } from './visual/tokens/tokens-demo.component';
import { VisualComponent } from './visual/visual.component';
import { SkyWaitDemoComponent } from './visual/wait/wait-demo.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent,
  },
  {
    path: 'visual/alert',
    component: AlertVisualComponent,
  },
  {
    path: 'visual/chevron',
    component: SkyChevronDemoComponent,
  },
  {
    path: 'visual/help-inline',
    component: SkyHelpInlineDemoComponent,
  },
  {
    path: 'visual/icon',
    component: SkyIconDemoComponent,
  },
  {
    path: 'visual/icon-stack',
    component: SkyIconStackDemoComponent,
  },
  {
    path: 'visual/key-info',
    component: KeyInfoVisualComponent,
  },
  {
    path: 'visual/label',
    component: SkyLabelDemoComponent,
  },
  {
    path: 'visual/status-indicator',
    component: StatusIndicatorVisualComponent,
  },
  {
    path: 'visual/text-highlight',
    component: SkyTextHighlightDemoComponent,
  },
  {
    path: 'visual/tokens',
    component: SkyTokensDemoComponent,
  },
  {
    path: 'visual/wait',
    component: SkyWaitDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
