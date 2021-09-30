import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyOverlayModule
} from '../overlay.module';

import {
  OverlayFixtureComponent
} from './overlay.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyOverlayModule
  ],
  declarations: [
    OverlayFixtureComponent
  ],
  exports: [
    OverlayFixtureComponent
  ]
})
export class OverlayFixturesModule { }
