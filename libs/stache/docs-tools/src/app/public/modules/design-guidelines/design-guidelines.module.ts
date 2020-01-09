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
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
    SkyDocsDesignGuidelinesComponent
  ],
  exports: [
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
    SkyDocsDesignGuidelinesComponent
  ]
})
export class SkyDocsDesignGuidelinesModule { }
