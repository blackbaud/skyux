import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  BrowserModule
} from '@angular/platform-browser';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  SkyActionButtonModule
} from '../action-button.module';

import {
  ActionButtonTestComponent
} from './action-button.component.fixture';

@NgModule({
  declarations: [
    ActionButtonTestComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterTestingModule,
    SkyActionButtonModule
  ],
  providers: [
    SkyCoreAdapterService
  ]
})
export class SkyActionButtonFixturesModule { }
