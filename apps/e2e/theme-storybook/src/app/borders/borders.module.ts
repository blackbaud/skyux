import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BordersComponent } from './borders.component';

const routes: Routes = [{ path: '', component: BordersComponent }];
@NgModule({
  declarations: [BordersComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [BordersComponent],
})
export class BordersModule {}
