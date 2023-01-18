import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyPageModule } from '@skyux/layout';

import { PageComponent } from './page.component';

const routes: Routes = [{ path: '', component: PageComponent }];
@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyPageModule],
  exports: [PageComponent],
})
export class PageModule {}
