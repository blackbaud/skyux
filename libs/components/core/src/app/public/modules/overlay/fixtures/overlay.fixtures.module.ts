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
  OverlayEntryFixtureComponent
} from './overlay-entry.component.fixture';

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
    OverlayEntryFixtureComponent,
    OverlayFixtureComponent
  ],
  exports: [
    OverlayEntryFixtureComponent,
    OverlayFixtureComponent
  ],
  entryComponents: [
    OverlayEntryFixtureComponent
  ]
})
export class OverlayFixturesModule { }
