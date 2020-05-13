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
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyLookupResourcesModule
} from '../shared/lookup-resources.module';

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
    SkyLookupResourcesModule,
    SkyMediaQueryModule,
    FormsModule,
    SkyIconModule
  ],
  exports: [
    SkySearchComponent
  ]
})
export class SkySearchModule { }
