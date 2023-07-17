import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyTextExpandModule } from '@skyux/layout';

import { TextExpandComponent } from './text-expand.component';

const routes: Routes = [{ path: '', component: TextExpandComponent }];
@NgModule({
  declarations: [TextExpandComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyTextExpandModule],
  exports: [TextExpandComponent],
})
export class TextExpandModule {}
