import {
  NgModule
} from '@angular/core';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyProgressIndicatorModule
} from './public';

import {
  ProgressIndicatorWizardDemoComponent
} from './visual/progress-indicator/progress-indicator-horizontal-visual.component';

@NgModule({
  exports: [
    SkyModalModule,
    SkyPopoverModule,
    SkyProgressIndicatorModule
  ],
  entryComponents: [
    ProgressIndicatorWizardDemoComponent
  ]
})
export class AppExtrasModule { }
