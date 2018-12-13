import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';

import {
  SkyWindowRefService,
  SkyDynamicComponentModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyModalsResourcesModule
} from '../shared';

import {
  SkyModalAdapterService
} from './modal-adapter.service';

import {
  SkyModalContentComponent
} from './modal-content.component';

import {
  SkyModalFooterComponent
} from './modal-footer.component';

import {
  SkyModalHeaderComponent
} from './modal-header.component';

import {
  SkyModalHostComponent
} from './modal-host.component';

import {
  SkyModalComponent
} from './modal.component';

import {
  SkyModalService
} from './modal.service';

@NgModule({
  declarations: [
    SkyModalComponent,
    SkyModalContentComponent,
    SkyModalFooterComponent,
    SkyModalHeaderComponent,
    SkyModalHostComponent
  ],
  providers: [
    SkyModalAdapterService,
    SkyModalService,
    SkyWindowRefService
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyDynamicComponentModule,
    SkyI18nModule,
    SkyIconModule,
    SkyModalsResourcesModule
  ],
  exports: [
    SkyModalComponent,
    SkyModalContentComponent,
    SkyModalFooterComponent,
    SkyModalHeaderComponent
  ],
  entryComponents: [
    SkyModalHostComponent
  ]
})
export class SkyModalModule { }
