import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyKeyInfoModule
} from '@skyux/indicators';

import {
  SkyModalModule,
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySplitViewModule
} from '@skyux/split-view';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  SummaryActionBarModalDocsComponent
} from './docs/summary-action-bar/summary-action-bar-modal-docs.component';

import {
  SkySummaryActionBarModalDemoComponent
} from './visual/summary-action-bar/summary-action-bar-modal-demo.component';

import {
  SkySummaryActionBarModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkyDocsToolsModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkySummaryActionBarModule,
    SkyTabsModule,
    SkySplitViewModule,
    NoopAnimationsModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-action-bars',
        packageName: '@skyux/action-bars'
      }
    }
  ],
  entryComponents: [
    SkySummaryActionBarModalDemoComponent,
    SummaryActionBarModalDocsComponent
  ]
})
export class AppExtrasModule { }
