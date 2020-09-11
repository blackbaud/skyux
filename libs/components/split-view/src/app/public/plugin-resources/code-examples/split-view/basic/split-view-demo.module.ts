import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkySummaryActionBarModule
} from '@skyux/action-bars';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkySplitViewModule
} from '@skyux/split-view';

import {
  SplitViewDemoComponent
} from './split-view-demo.component';

@NgModule({
  declarations: [
    SplitViewDemoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyConfirmModule,
    SkyDefinitionListModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule
  ],
  exports: [
    SplitViewDemoComponent
  ]
})
export class SplitViewDemoModule { }
