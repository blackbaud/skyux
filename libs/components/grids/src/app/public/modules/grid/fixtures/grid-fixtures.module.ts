import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyGridModule
} from '../';

import {
  GridTestComponent
} from './grid.component.fixture';

import {
  GridEmptyTestComponent
} from './grid-empty.component.fixture';

import {
  GridDynamicTestComponent
} from './grid-dynamic.component.fixture';

import {
  GridAsyncTestComponent
} from './grid-async.component.fixture';

import {
  GridInteractiveTestComponent
} from './grid-interactive.component.fixture';

@NgModule({
  declarations: [
    GridTestComponent,
    GridEmptyTestComponent,
    GridDynamicTestComponent,
    GridAsyncTestComponent,
    GridInteractiveTestComponent
  ],
  imports: [
    CommonModule,
    SkyGridModule
  ],
  providers: [
    SkyWindowRefService
  ],
  exports: [
    GridTestComponent,
    GridEmptyTestComponent,
    GridDynamicTestComponent,
    GridAsyncTestComponent,
    GridInteractiveTestComponent
  ]
})
export class GridFixturesModule { }
