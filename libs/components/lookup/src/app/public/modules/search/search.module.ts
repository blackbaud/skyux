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
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkySearchComponent
} from './search.component';

@NgModule({
  declarations: [
    SkySearchComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyI18nModule,
    SkyMediaQueryModule,
    FormsModule,
    SkyIconModule
  ],
  exports: [
    SkySearchComponent
  ]
})
export class SkySearchModule { }
