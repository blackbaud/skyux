import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDockModule
} from '../dock.module';

import {
  DockItemFixtureComponent
} from './dock-item.component.fixture';

import {
  DockFixtureComponent
} from './dock.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    SkyDockModule
  ],
  exports: [
    DockFixtureComponent,
    DockItemFixtureComponent
  ],
  declarations: [
    DockFixtureComponent,
    DockItemFixtureComponent
  ],
  entryComponents: [
    DockItemFixtureComponent
  ]
})
export class DockFixturesModule { }
