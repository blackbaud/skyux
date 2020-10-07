import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule,
  SkyCodeBlockModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyAlertModule
} from '@skyux/indicators';

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
  ProgressIndicatorWizardVisualComponent
} from './visual/progress-indicator/progress-indicator-horizontal-visual.component';
import {
  ProgressIndicatorWaterfallDemoFormComponent
} from './docs/waterfall-indicator/progress-indicator-waterfall-demo-form.component';

import {
  WizardDemoModalComponent
} from './docs/wizard/wizard-docs-demo-modal.component';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyCodeModule,
    SkyCodeBlockModule,
    SkyDocsToolsModule,
    SkyModalModule,
    SkyPopoverModule,
    SkyProgressIndicatorModule
  ],
  entryComponents: [
    ProgressIndicatorWizardVisualComponent,
    ProgressIndicatorWaterfallDemoFormComponent,
    WizardDemoModalComponent
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
