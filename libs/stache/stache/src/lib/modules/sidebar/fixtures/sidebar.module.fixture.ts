import {
  NgModule
} from '@angular/core';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  StacheSidebarModule
} from '../sidebar.module';

import {
  SidebarFixtureComponent
} from './sidebar.component.fixture';

@NgModule({
  declarations: [
    SidebarFixtureComponent
  ],
  imports: [
    RouterTestingModule,
    StacheSidebarModule
  ],
  exports: [
    SidebarFixtureComponent
  ]
})
export class SidebarFixtureModule { }
