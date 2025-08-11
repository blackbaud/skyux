import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';

import { ButtonsComponent } from './buttons.component';

const routes: Routes = [{ path: '', component: ButtonsComponent }];
@NgModule({
  imports: [
    ButtonsComponent,
    CommonModule,
    RouterModule.forChild(routes),
    SkyIconModule,
  ],
  exports: [ButtonsComponent],
})
export class ButtonsModule {}
