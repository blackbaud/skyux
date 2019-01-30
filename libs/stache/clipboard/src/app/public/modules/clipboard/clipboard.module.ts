import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyClipboardResourcesModule
} from '../shared';

import {
  SkyCopyToClipboardComponent
} from './clipboard.component';

import {
  SkyCopyToClipboardService
} from './clipboard.service';

@NgModule({
  declarations: [
    SkyCopyToClipboardComponent
  ],
  imports: [
    CommonModule,
    SkyClipboardResourcesModule,
    SkyI18nModule
  ],
  exports: [
    SkyCopyToClipboardComponent
  ],
  providers: [
    SkyCopyToClipboardService,
    SkyAppWindowRef
  ]
})
export class SkyClipboardModule { }
