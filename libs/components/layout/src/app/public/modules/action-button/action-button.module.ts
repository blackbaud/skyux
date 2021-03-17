import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyActionButtonAdapterService
} from './action-button-adapter-service';

import {
  SkyActionButtonContainerComponent
} from './action-button-container.component';

import {
  SkyActionButtonDetailsComponent
} from './action-button-details.component';

import {
  SkyActionButtonHeaderComponent
} from './action-button-header.component';

import {
  SkyActionButtonIconComponent
} from './action-button-icon.component';

import {
  SkyActionButtonComponent
} from './action-button.component';

@NgModule({
  declarations: [
    SkyActionButtonComponent,
    SkyActionButtonContainerComponent,
    SkyActionButtonDetailsComponent,
    SkyActionButtonHeaderComponent,
    SkyActionButtonIconComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyIconModule,
    SkyMediaQueryModule,
    SkyThemeModule
  ],
  exports: [
    SkyActionButtonComponent,
    SkyActionButtonContainerComponent,
    SkyActionButtonDetailsComponent,
    SkyActionButtonHeaderComponent,
    SkyActionButtonIconComponent
  ],
  providers: [
    SkyActionButtonAdapterService
  ]
})
export class SkyActionButtonModule { }
