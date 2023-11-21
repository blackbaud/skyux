import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyUIConfigService } from '@skyux/core';
import { SkyPopoverModule } from '@skyux/popovers';

import { of as observableOf } from 'rxjs';

import { SkyGridLegacyModule } from '../grid-legacy.module';

import { GridLegacyAsyncTestComponent } from './grid-legacy-async.component.fixture';
import { GridLegacyDynamicTestComponent } from './grid-legacy-dynamic.component.fixture';
import { GridLegacyEmptyTestComponent } from './grid-legacy-empty.component.fixture';
import { GridLegacyInteractiveTestComponent } from './grid-legacy-interactive.component.fixture';
import { GridLegacyNoHeaderTestComponent } from './grid-legacy-no-header.component.fixture';
import { GridLegacyUndefinedTestComponent } from './grid-legacy-undefined.component.fixture';
import { GridLegacyTestComponent } from './grid-legacy.component.fixture';

@NgModule({
  declarations: [
    GridLegacyTestComponent,
    GridLegacyEmptyTestComponent,
    GridLegacyDynamicTestComponent,
    GridLegacyAsyncTestComponent,
    GridLegacyInteractiveTestComponent,
    GridLegacyUndefinedTestComponent,
    GridLegacyNoHeaderTestComponent,
  ],
  imports: [
    CommonModule,
    SkyGridLegacyModule,
    SkyPopoverModule,
    NoopAnimationsModule,
  ],
  providers: [
    {
      provide: SkyUIConfigService,
      useValue: {
        getConfig: () =>
          observableOf({
            selectedColumnIds: [],
          }),
        setConfig: () => observableOf({}),
      },
    },
  ],
  exports: [
    GridLegacyTestComponent,
    GridLegacyEmptyTestComponent,
    GridLegacyDynamicTestComponent,
    GridLegacyAsyncTestComponent,
    GridLegacyInteractiveTestComponent,
    GridLegacyUndefinedTestComponent,
    GridLegacyNoHeaderTestComponent,
  ],
})
export class GridLegacyFixturesModule {}
