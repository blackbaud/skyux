//#region imports

import {
  NgModule
} from '@angular/core';

import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';

import {
  SkyAuthInterceptor
} from './auth-interceptor';

//#endregion

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SkyAuthInterceptor,
      multi: true
    }
  ],
  exports: [
    HttpClientModule
  ]
})
export class SkyAuthHttpClientModule { }
