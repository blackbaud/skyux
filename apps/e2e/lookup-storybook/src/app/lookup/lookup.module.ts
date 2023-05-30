import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LookupComponent } from './lookup.component';

const routes: Routes = [{ path: '', component: LookupComponent }];
@NgModule({
  declarations: [LookupComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [LookupComponent],
})
export class LookupModule {}
