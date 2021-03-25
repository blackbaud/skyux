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
  SkyActionButtonModule
} from '../action-button.module';

import {
  ActionButtonNgforTestComponent
} from './action-button-ngfor.component.fixture';

import {
  ActionButtonTestComponent
} from './action-button.component.fixture';

@NgModule({
  declarations: [
    ActionButtonTestComponent,
    ActionButtonNgforTestComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterTestingModule,
    SkyActionButtonModule
  ]
})
export class SkyActionButtonFixturesModule { }
