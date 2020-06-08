import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyNavbarModule
} from '../navbar.module';

import {
  SkyNavbarTestComponent
} from './navbar.component.fixture';

@NgModule({
  declarations: [
    SkyNavbarTestComponent
  ],
  imports: [
    CommonModule,
    SkyNavbarModule
  ],
  exports: [
    SkyNavbarTestComponent
  ]
})
export class SkyNavbarFixturesModule { }
