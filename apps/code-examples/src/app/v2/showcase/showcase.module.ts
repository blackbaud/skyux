import { NgModule } from '@angular/core';

import { SkyShowcaseAreaDevelopmentComponent } from './showcase-area-development.component';
import { SkyShowcaseAreaExamplesComponent } from './showcase-area-examples.component';
import { SkyShowcaseAreaOverviewComponent } from './showcase-area-overview.component';
import { SkyShowcaseAreaTestingComponent } from './showcase-area-testing.component';
import { SkyShowcaseComponent } from './showcase.component';

@NgModule({
  imports: [
    SkyShowcaseComponent,
    SkyShowcaseAreaDevelopmentComponent,
    SkyShowcaseAreaExamplesComponent,
    SkyShowcaseAreaOverviewComponent,
    SkyShowcaseAreaTestingComponent,
  ],
  exports: [
    SkyShowcaseComponent,
    SkyShowcaseAreaDevelopmentComponent,
    SkyShowcaseAreaOverviewComponent,
    SkyShowcaseAreaTestingComponent,
  ],
})
export class SkyShowcaseModule {}
