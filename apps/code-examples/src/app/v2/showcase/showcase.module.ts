import { NgModule } from '@angular/core';

import { SkyDocsShowcaseAreaDevelopmentComponent } from './showcase-area-development.component';
import { SkyDocsShowcaseAreaExamplesComponent } from './showcase-area-examples.component';
import { SkyDocsShowcaseAreaOverviewComponent } from './showcase-area-overview.component';
import { SkyDocsShowcaseAreaTestingComponent } from './showcase-area-testing.component';
import { SkyDocsShowcaseComponent } from './showcase.component';

/**
 * @internal
 */
@NgModule({
  imports: [
    SkyDocsShowcaseComponent,
    SkyDocsShowcaseAreaDevelopmentComponent,
    SkyDocsShowcaseAreaExamplesComponent,
    SkyDocsShowcaseAreaOverviewComponent,
    SkyDocsShowcaseAreaTestingComponent,
  ],
  exports: [
    SkyDocsShowcaseComponent,
    SkyDocsShowcaseAreaDevelopmentComponent,
    SkyDocsShowcaseAreaOverviewComponent,
    SkyDocsShowcaseAreaTestingComponent,
  ],
})
export class SkyDocsShowcaseModule {}
