import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InlineFormComponent } from './inline-form.component';

const routes: Routes = [{ path: '', component: InlineFormComponent }];
@NgModule({
  declarations: [InlineFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [InlineFormComponent],
})
export class InlineFormModule {}
