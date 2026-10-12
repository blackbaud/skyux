import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';

import { IconComponent } from './icon.component';

const routes: Routes = [{ path: '', component: IconComponent }];
@NgModule({
  declarations: [IconComponent],
  imports: [
    SkyButton,
    CommonModule,
    RouterModule.forChild(routes),
    SkyIconModule,
  ],
  exports: [IconComponent],
})
export class IconModule {}
