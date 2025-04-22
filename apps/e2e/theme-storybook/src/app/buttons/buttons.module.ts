import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ButtonsComponent } from './buttons.component';

const routes: Routes = [{ path: '', component: ButtonsComponent }];
@NgModule({
  imports: [ButtonsComponent, CommonModule, RouterModule.forChild(routes)],
  exports: [ButtonsComponent],
})
export class ButtonsModule {}
