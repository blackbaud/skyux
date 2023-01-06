import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySkipLinkModule } from '@skyux/a11y';

import { SkipLinkComponent } from './skip-link.component';

const routes: Routes = [{ path: '', component: SkipLinkComponent }];
@NgModule({
  declarations: [SkipLinkComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkySkipLinkModule],
  exports: [SkipLinkComponent],
})
export class SkipLinkModule {}
