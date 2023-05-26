import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularTreeComponentComponent } from './angular-tree-component.component';

const routes: Routes = [{ path: '', component: AngularTreeComponentComponent }];
@NgModule({
  declarations: [AngularTreeComponentComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [AngularTreeComponentComponent],
})
export class AngularTreeComponentModule {}
