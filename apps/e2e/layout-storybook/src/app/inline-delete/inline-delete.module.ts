import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyInlineDeleteModule } from '@skyux/layout';

import { InlineDeleteComponent } from './inline-delete.component';

const routes: Routes = [{ path: '', component: InlineDeleteComponent }];
@NgModule({
  declarations: [InlineDeleteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyIconModule,
    SkyInlineDeleteModule,
  ],
  exports: [InlineDeleteComponent],
})
export class InlineDeleteModule {}
