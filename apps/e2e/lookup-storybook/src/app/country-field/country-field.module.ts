import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CountryFieldComponent } from './country-field.component';

const routes: Routes = [{ path: '', component: CountryFieldComponent }];
@NgModule({
  declarations: [CountryFieldComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CountryFieldComponent],
})
export class CountryFieldModule {}
