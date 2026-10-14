import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton } from '@skyux/forms';
import { SkyInlineDeleteModule } from '@skyux/layout';

import { InlineDeleteComponent } from './inline-delete.component';

const routes: Routes = [{ path: '', component: InlineDeleteComponent }];
@NgModule({
  declarations: [InlineDeleteComponent],
  imports: [
    SkyButton,
    CommonModule,
    RouterModule.forChild(routes),
    SkyInlineDeleteModule,
  ],
  exports: [InlineDeleteComponent],
})
export class InlineDeleteModule {}
