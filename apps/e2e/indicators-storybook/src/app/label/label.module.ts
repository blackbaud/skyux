import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyLabelModule } from '@skyux/indicators';

import { LabelComponent } from './label.component';

const routes: Routes = [{ path: '', component: LabelComponent }];
@NgModule({
  declarations: [LabelComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyLabelModule],
  exports: [LabelComponent],
})
export class LabelModule {}
