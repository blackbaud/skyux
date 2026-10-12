import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton } from '@skyux/forms';
import { SkyTextHighlightModule } from '@skyux/indicators';

import { TextHighlightComponent } from './text-highlight.component';

const routes: Routes = [{ path: '', component: TextHighlightComponent }];
@NgModule({
  declarations: [TextHighlightComponent],
  imports: [
    SkyButton,
    CommonModule,
    RouterModule.forChild(routes),
    SkyTextHighlightModule,
  ],
  exports: [TextHighlightComponent],
})
export class TextHighlightModule {}
