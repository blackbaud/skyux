import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkyKeyInfoModule
} from '@skyux/indicators';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SummaryActionBarDemoComponent
} from './summary-action-bar-demo.component';

import {
  SkySummaryActionBarModalDemoComponent
} from './summary-action-bar-modal-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkySummaryActionBarModule
  ],
  exports: [
    SummaryActionBarDemoComponent
  ],
  declarations: [
    SummaryActionBarDemoComponent,
    SkySummaryActionBarModalDemoComponent
  ],
  entryComponents: [
    SkySummaryActionBarModalDemoComponent
  ]
})
export class SummaryActionBarDemoModule { }
