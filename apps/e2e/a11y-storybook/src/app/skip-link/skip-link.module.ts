import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkipLinkComponent } from './skip-link.component';

const routes: Routes = [{ path: '', component: SkipLinkComponent }];
@NgModule({
  declarations: [SkipLinkComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [SkipLinkComponent],
})
export class SkipLinkModule {}
