import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyFluidGridModule } from '@skyux/layout';

import { SkyDocsThumbnailModule } from '../thumbnail/thumbnail.module';

import { SkyDocsDesignGuidelineComponent } from './design-guideline.component';

import { SkyDocsDesignGuidelinesComponent } from './design-guidelines.component';

import { SkyDocsDesignGuidelineThumbnailComponent } from './design-guideline-thumbnail.component';

@NgModule({
  imports: [CommonModule, SkyDocsThumbnailModule, SkyFluidGridModule],
  declarations: [
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
    SkyDocsDesignGuidelinesComponent,
  ],
  exports: [
    SkyDocsDesignGuidelineComponent,
    SkyDocsDesignGuidelineThumbnailComponent,
    SkyDocsDesignGuidelinesComponent,
  ],
})
export class SkyDocsDesignGuidelinesModule {}
