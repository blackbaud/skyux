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
  MutationObserverService,
  SkyAppWindowRef,
  SkyCoreAdapterModule,
  SkyDynamicComponentModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyModalsResourcesModule
} from '../shared/modals-resources.module';

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
  SkyModalScrollShadowDirective
} from './modal-scroll-shadow.directive';

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
    SkyModalHostComponent,
    SkyModalScrollShadowDirective
  ],
  providers: [
    MutationObserverService,
    SkyModalAdapterService,
    SkyModalService,
    SkyAppWindowRef
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyCoreAdapterModule,
    SkyDynamicComponentModule,
    SkyI18nModule,
    SkyIconModule,
    SkyModalsResourcesModule,
    SkyThemeModule
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
