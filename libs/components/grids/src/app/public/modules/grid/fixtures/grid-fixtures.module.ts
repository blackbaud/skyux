import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyGridModule
} from '../grid.module';

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

import {
  GridUndefinedTestComponent
} from './grid-undefined.component.fixture';

@NgModule({
  declarations: [
    GridTestComponent,
    GridEmptyTestComponent,
    GridDynamicTestComponent,
    GridAsyncTestComponent,
    GridInteractiveTestComponent,
    GridUndefinedTestComponent
  ],
  imports: [
    CommonModule,
    SkyGridModule,
    SkyPopoverModule
  ],
  providers: [
    {
      provide: SkyUIConfigService,
      useValue: {
        getConfig: () => Observable.of({
          selectedColumnIds: []
        }),
        setConfig: () => Observable.of({})
      }
    }
  ],
  exports: [
    GridTestComponent,
    GridEmptyTestComponent,
    GridDynamicTestComponent,
    GridAsyncTestComponent,
    GridInteractiveTestComponent,
    GridUndefinedTestComponent
  ]
})
export class GridFixturesModule { }
