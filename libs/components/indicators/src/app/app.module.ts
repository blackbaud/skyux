import {
  NgModule
} from '@angular/core';

import {
  HttpModule
} from '@angular/http';

import {
  BrowserModule
} from '@angular/platform-browser';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  AppRoutingModule
} from './app-routing.module';

import {
  AppComponent
} from './app.component';

import {
  SkyActionButtonDemoModule,
  SkyChevronDemoModule,
  SkyHelpInlineDemoModule,
  SkyIconDemoModule,
  SkyLabelDemoModule,
  SkyTextHighlightDemoModule,
  SkyTokensDemoModule,
  SkyWaitDemoModule
} from './demos';

require('style-loader!@skyux/theme/css/sky.css');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpModule,
    SkyActionButtonDemoModule,
    SkyChevronDemoModule,
    SkyHelpInlineDemoModule,
    SkyIconDemoModule,
    SkyLabelDemoModule,
    SkyTextHighlightDemoModule,
    SkyTokensDemoModule,
    SkyWaitDemoModule
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    SkyAppAssetsService,
    SkyAppWindowRef
  ]
})
export class AppModule { }
