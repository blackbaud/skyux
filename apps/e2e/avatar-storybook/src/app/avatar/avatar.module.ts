import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAvatarModule } from '@skyux/avatar';

import { AvatarComponent } from './avatar.component';

const routes: Routes = [{ path: '', component: AvatarComponent }];
@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyAvatarModule],
  exports: [AvatarComponent],
})
export class AvatarModule {}
