import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyBackToTopFixtureComponent
} from './back-to-top.component.fixture';

import {
  SkyBackToTopModule
} from '../back-top-top.module';

@NgModule({
  imports: [
    CommonModule,
    SkyBackToTopModule
  ],
  exports: [
    SkyBackToTopFixtureComponent
  ],
  declarations: [
    SkyBackToTopFixtureComponent
  ]
})
export class SkyBackToTopFixturesModule { }
