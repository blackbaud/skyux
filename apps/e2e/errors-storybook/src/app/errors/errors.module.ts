import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorsComponent } from './errors.component';

const routes: Routes = [{ path: '', component: ErrorsComponent }];
@NgModule({
  declarations: [ErrorsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ErrorsComponent],
})
export class ErrorsModule {}
