import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AvatarComponent } from './avatar.component';

const routes: Routes = [{ path: '', component: AvatarComponent }];
@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [AvatarComponent],
})
export class AvatarModule {}
