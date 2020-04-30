import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAuthTokenProvider
} from '@skyux/http';

import {
  SkyDocsDemoModule
} from '../demo.module';

import {
  DemoFixtureComponent
} from './demo.component.fixture';

import {
  DemoAuthTokenMockProvider
} from './demo-auth-token-mock-provider';

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
  ],
  providers: [
    {
      provide: SkyAuthTokenProvider,
      useClass: DemoAuthTokenMockProvider
    }
  ]
})
export class DemoFixturesModule { }
