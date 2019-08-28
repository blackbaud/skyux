import {
  NgModule
} from '@angular/core';

import { SkyIconModule } from '@skyux/indicators';
import { SkyDocsSectionAnchorComponent } from './section-anchor.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SkyDocsSectionAnchorComponent
  ],
  imports: [
    RouterModule,
    SkyIconModule
  ],
  exports: [
    SkyDocsSectionAnchorComponent
  ]
})
export class SkyDocsSectionAnchorModule { }
