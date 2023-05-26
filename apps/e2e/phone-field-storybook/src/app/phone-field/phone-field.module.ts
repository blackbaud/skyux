import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhoneFieldComponent } from './phone-field.component';

const routes: Routes = [{ path: '', component: PhoneFieldComponent }];
@NgModule({
  declarations: [PhoneFieldComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [PhoneFieldComponent],
})
export class PhoneFieldModule {}
