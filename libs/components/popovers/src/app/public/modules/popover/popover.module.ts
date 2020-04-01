import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyAffixModule,
  SkyCoreAdapterModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyPopoversResourcesModule
} from '../shared';

import {
  SkyPopoverAdapterService
} from './popover-adapter.service';

import {
  SkyPopoverContentComponent
} from './popover-content.component';

import {
  SkyPopoverComponent
} from './popover.component';

import {
  SkyPopoverDirective
} from './popover.directive';

@NgModule({
  declarations: [
    SkyPopoverComponent,
    SkyPopoverContentComponent,
    SkyPopoverDirective
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyAffixModule,
    SkyCoreAdapterModule,
    SkyIconModule,
    SkyOverlayModule,
    SkyPopoversResourcesModule
  ],
  exports: [
    SkyPopoverComponent,
    SkyPopoverContentComponent,
    SkyPopoverDirective
  ],
  entryComponents: [
    SkyPopoverContentComponent
  ],
  providers: [
    SkyPopoverAdapterService
  ]
})
export class SkyPopoverModule { }
