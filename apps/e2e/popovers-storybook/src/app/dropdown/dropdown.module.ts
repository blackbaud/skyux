import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DropdownComponent } from './dropdown.component';

const routes: Routes = [{ path: '', component: DropdownComponent }];
@NgModule({
  declarations: [DropdownComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DropdownComponent],
})
export class DropdownModule {}
