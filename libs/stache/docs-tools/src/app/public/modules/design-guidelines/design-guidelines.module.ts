import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyImageModule
} from '@blackbaud/skyux-lib-media';

import {
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyDocsAnatomyComponent
} from './anatomy.component';

import {
  SkyDocsAnatomyItemComponent
} from './anatomy-item.component';

import {
  SkyDocsDesignGuidelineComponent
} from './design-guideline.component';

import {
  SkyDocsDesignGuidelinesComponent
} from './design-guidelines.component';

import {
  SkyDocsDesignGuidelineThumbnailComponent
} from './design-guideline-thumbnail.component';

@NgModule({
  imports: [
    CommonModule,
    SkyFluidGridModule,
    SkyImageModule
  ],
  declarations: [
    SkyDocsAnatomyComponent,
    SkyDocsAnatomyItemComponent,
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
    SkyDocsDesignGuidelinesComponent
  ],
  exports: [
    SkyDocsAnatomyComponent,
    SkyDocsAnatomyItemComponent,
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
    SkyDocsDesignGuidelinesComponent
  ]
})
export class SkyDocsDesignGuidelinesModule { }
