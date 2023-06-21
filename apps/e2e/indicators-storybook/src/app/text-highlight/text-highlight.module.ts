import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TextHighlightComponent } from './text-highlight.component';

const routes: Routes = [{ path: '', component: TextHighlightComponent }];
@NgModule({
  declarations: [TextHighlightComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [TextHighlightComponent],
})
export class TextHighlightModule {}
