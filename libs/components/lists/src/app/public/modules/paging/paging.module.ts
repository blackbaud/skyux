import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyPagingComponent
} from './paging.component';
import {
  SkyI18nModule
} from '@skyux/i18n/modules/i18n';
import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

@NgModule({
  declarations: [
    SkyPagingComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule
  ],
  exports: [
    SkyPagingComponent
  ]
})
export class SkyPagingModule {
}
