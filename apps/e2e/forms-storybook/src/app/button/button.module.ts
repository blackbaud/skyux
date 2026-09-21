import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';

import { ButtonComponent } from './button.component';

const routes: Routes = [{ path: '', component: ButtonComponent }];
@NgModule({
  imports: [
    ButtonComponent,
    CommonModule,
    RouterModule.forChild(routes),
    SkyIconModule,
  ],
  exports: [ButtonComponent],
})
export class ButtonModule {}
