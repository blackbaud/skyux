import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyProgressIndicatorModule
} from './public/public_api';

import {
  ProgressIndicatorWizardDemoComponent
} from './visual/progress-indicator/progress-indicator-horizontal-visual.component';
import {
  SkyProgressIndicatorWaterfallDemoFormComponent
} from './docs/waterfall-indicator/progress-indicator-waterfall-demo-form.component';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyDocsToolsModule,
    SkyModalModule,
    SkyPopoverModule,
    SkyProgressIndicatorModule
  ],
  entryComponents: [
    ProgressIndicatorWizardDemoComponent,
    SkyProgressIndicatorWaterfallDemoFormComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-progress-indicator',
        packageName: '@skyux/progress-indicator'
      }
    }
  ]
})
export class AppExtrasModule { }
