import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyMediaQueryService
} from './media-query.service';

@NgModule({
  providers: [
    SkyMediaQueryService
  ],
  imports: [
    CommonModule
  ]
})
export class SkyMediaQueryModule { }
