import {
  NgModule
} from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  SkyActionButtonDemoComponent,
  SkyChevronDemoComponent,
  SkyHelpInlineDemoComponent,
  SkyIconDemoComponent,
  SkyLabelDemoComponent,
  SkyTextHighlightDemoComponent,
  SkyTokensDemoComponent,
  SkyWaitDemoComponent
} from './demos';

const appRoutes: Routes = [
  {
    path: 'demos/action-button',
    component: SkyActionButtonDemoComponent
  },
  {
    path: 'demos/chevron',
    component: SkyChevronDemoComponent
  },
  {
    path: 'demos/help-inline',
    component: SkyHelpInlineDemoComponent
  },
  {
    path: 'demos/icon',
    component: SkyIconDemoComponent
  },
  {
    path: 'demos/label',
    component: SkyLabelDemoComponent
  },
  {
    path: 'demos/text-highlight',
    component: SkyTextHighlightDemoComponent
  },
  {
    path: 'demos/tokens',
    component: SkyTokensDemoComponent
  },
  {
    path: 'demos/wait',
    component: SkyWaitDemoComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }
