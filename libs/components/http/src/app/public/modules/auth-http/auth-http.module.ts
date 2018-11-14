//#region imports

import {
  NgModule
} from '@angular/core';

import {
  SkyAuthHttp
} from './auth-http';

import {
  SkyAuthTokenProvider
} from './auth-token-provider';

//#endregion

@NgModule({
  providers: [
    SkyAuthHttp,
    SkyAuthTokenProvider
  ]
})
export class SkyAuthHttpModule { }
