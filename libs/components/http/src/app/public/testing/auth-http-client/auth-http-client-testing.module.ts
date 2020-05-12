import {
  NgModule
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  SkyAuthHttpClientModule,
  SkyAuthTokenProvider
} from '@skyux/http';

import {
  SkyAuthTokenMockProvider
} from '../auth-http/auth-token-mock-provider';

import {
  SkyAuthHttpTestingController
} from './auth-http-testing-controller';

import {
  SkyMockAppConfig
} from './mock-app-config';

/**
 * Overrides the default token logic in `SkyAuthHttpInterceptor` so code that
 * makes authenticated HTTP calls can be unit tested.
 */
@NgModule({
  imports: [
    SkyAuthHttpClientModule
  ],
  providers: [
    SkyAuthHttpTestingController,
    {
      provide: SkyAuthTokenProvider,
      useClass: SkyAuthTokenMockProvider
    },
    {
      provide: SkyAppConfig,
      useClass: SkyMockAppConfig
    }
  ]
})
export class SkyAuthHttpClientTestingModule { }
