import {
  NgModule
} from '@angular/core';

import {
  SkyAuthTokenProvider
} from '../../modules/auth-http/auth-token-provider';

import {
  SkyAuthTokenMockProvider
} from '../auth-http/auth-token-mock-provider';

import {
  SkyAuthHttpTestingController
} from './auth-http-testing-controller';

/**
 * Overrides the default token logic in `SkyAuthHttpInterceptor` so code that
 * makes authenticated HTTP calls can be unit tested.
 */
@NgModule({
  providers: [
    SkyAuthHttpTestingController,
    {
      provide: SkyAuthTokenProvider,
      useClass: SkyAuthTokenMockProvider
    }
  ]
})
export class SkyAuthHttpClientTestingModule { }
