import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResponsiveContentComponent } from './responsive-content.component';
import { ResponsiveComponent } from './responsive.component';

const routes: Routes = [{ path: '', component: ResponsiveComponent }];
@NgModule({
  declarations: [ResponsiveComponent, ResponsiveContentComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ResponsiveComponent],
})
export class ResponsiveModule {}
