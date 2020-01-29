import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsDemoModule
} from '../demo.module';

import {
  DemoFixtureComponent
} from './demo.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsDemoModule
  ],
  exports: [
    DemoFixtureComponent
  ],
  declarations: [
    DemoFixtureComponent
  ]
})
export class DemoFixturesModule { }
