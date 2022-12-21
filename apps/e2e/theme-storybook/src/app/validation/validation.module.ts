import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ValidationComponent } from './validation.component';

const routes: Routes = [{ path: '', component: ValidationComponent }];
@NgModule({
  declarations: [ValidationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
  exports: [ValidationComponent],
})
export class ValidationModule {}
