import { NgModule } from '@angular/core';

import { SkyDocsAnatomyItemComponent } from './anatomy-item.component';
import { SkyDocsAnatomyComponent } from './anatomy.component';
import { SkyDocsDesignGuidelineThumbnailComponent } from './design-guideline-thumbnail.component';
import { SkyDocsDesignGuidelineComponent } from './design-guideline.component';
import { SkyDocsDesignGuidelinesComponent } from './design-guidelines.component';

/**
 * @internal
 */
@NgModule({
  imports: [
    SkyDocsAnatomyComponent,
    SkyDocsAnatomyItemComponent,
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelinesComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
  ],
  exports: [
    SkyDocsAnatomyComponent,
    SkyDocsAnatomyItemComponent,
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelinesComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
  ],
})
export class SkyDocsDesignGuidelinesModule {}
