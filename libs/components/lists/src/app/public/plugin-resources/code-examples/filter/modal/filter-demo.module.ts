import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyFilterModule,
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  FilterDemoComponent
} from './filter-demo.component';

import {
  FilterDemoModalComponent
} from './filter-demo-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyIdModule,
    SkyCheckboxModule,
    SkyFilterModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  declarations: [
    FilterDemoComponent,
    FilterDemoModalComponent
  ],
  entryComponents: [
    FilterDemoModalComponent
  ],
  exports: [
    FilterDemoComponent
  ]
})
export class FilterDemoModule { }
