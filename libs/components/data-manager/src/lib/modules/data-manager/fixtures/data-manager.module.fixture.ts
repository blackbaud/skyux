import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyCardModule, SkyToolbarModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyThemeService } from '@skyux/theme';

import { SkyDataManagerFilterStateService } from '../data-manager-toolbar/data-manager-filter-state.service';
import { SkyDataManagerModule } from '../data-manager.module';
import { SkyDataManagerService } from '../data-manager.service';

import { DataViewCardFixtureComponent } from './data-manager-card-view.component.fixture';
import { DataViewRepeaterFixtureComponent } from './data-manager-repeater-view.component.fixture';
import { DataManagerFixtureComponent } from './data-manager.component.fixture';

@NgModule({
  imports: [NoopAnimationsModule],
  declarations: [
    DataViewCardFixtureComponent,
    DataViewRepeaterFixtureComponent,
    DataManagerFixtureComponent,
  ],
  exports: [
    SkyCardModule,
    SkyDataManagerModule,
    SkyRepeaterModule,
    SkyToolbarModule,
  ],
  providers: [
    SkyDataManagerService,
    SkyDataManagerFilterStateService,
    SkyThemeService,
  ],
})
export class DataManagerFixtureModule {}
