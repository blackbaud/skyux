import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyWindowRefService
} from '@skyux/core/modules/window';

import {
  SkyPopoverComponent
} from './popover.component';
import {
  SkyPopoverDirective
} from './popover.directive';
import {
  SkyI18nModule
} from '@skyux/i18n';
import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

@NgModule({
  declarations: [
    SkyPopoverComponent,
    SkyPopoverDirective
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyI18nModule,
    SkyIconModule
  ],
  exports: [
    SkyPopoverComponent,
    SkyPopoverDirective
  ],
  providers: [
    SkyWindowRefService
  ]
})
export class SkyPopoverModule { }
