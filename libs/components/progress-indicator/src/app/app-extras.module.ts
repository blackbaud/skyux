import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyModalModule,
  SkyModalService
} from '@skyux/modals';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyProgressIndicatorModule
} from './public/modules/progress-indicator';

import {
  ProgressIndicatorWizardDemoComponent
} from './visual/progress-indicator/progress-indicator-horizontal-visual.component';

@NgModule({
  imports: [
    CommonModule,
    SkyProgressIndicatorModule,
    SkyCheckboxModule,
    SkyModalModule,
    SkyPopoverModule
  ],
  exports: [
    SkyProgressIndicatorModule,
    SkyCheckboxModule,
    SkyModalModule,
    SkyPopoverModule
  ],
  providers: [
    SkyModalService
  ],
  entryComponents: [
    ProgressIndicatorWizardDemoComponent
  ]
})
export class AppExtrasModule { }
