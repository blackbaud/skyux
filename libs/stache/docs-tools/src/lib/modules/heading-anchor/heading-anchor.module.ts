import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';

import { SkyDocsHeadingAnchorComponent } from './heading-anchor.component';

@NgModule({
  declarations: [SkyDocsHeadingAnchorComponent],
  imports: [CommonModule, RouterModule, SkyIconModule],
  exports: [SkyDocsHeadingAnchorComponent],
})
export class SkyDocsHeadingAnchorModule {}
