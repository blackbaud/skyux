import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyChevronModule } from '@skyux/indicators';

import { ChevronComponent } from './chevron.component';

const routes: Routes = [{ path: '', component: ChevronComponent }];
@NgModule({
  declarations: [ChevronComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyChevronModule],
  exports: [ChevronComponent],
})
export class ChevronModule {}
