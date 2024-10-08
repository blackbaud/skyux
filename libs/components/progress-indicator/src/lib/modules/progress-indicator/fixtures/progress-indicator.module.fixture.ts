import { NgModule } from '@angular/core';

import { SkyProgressIndicatorModule } from '../progress-indicator.module';

import { SkyProgressIndicatorProgressHandlerFixtureComponent } from './progress-indicator-progress-handler.component.fixture';
import { SkyProgressIndicatorFixtureComponent } from './progress-indicator.component.fixture';

@NgModule({
  declarations: [
    SkyProgressIndicatorFixtureComponent,
    SkyProgressIndicatorProgressHandlerFixtureComponent,
  ],
  imports: [SkyProgressIndicatorModule],
  exports: [
    SkyProgressIndicatorFixtureComponent,
    SkyProgressIndicatorProgressHandlerFixtureComponent,
  ],
})
export class SkyProgressIndicatorFixtureModule {}
