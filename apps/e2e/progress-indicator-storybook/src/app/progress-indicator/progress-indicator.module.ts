import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProgressIndicatorComponent } from './progress-indicator.component';

const routes: Routes = [{ path: '', component: ProgressIndicatorComponent }];
@NgModule({
  declarations: [ProgressIndicatorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [ProgressIndicatorComponent],
})
export class ProgressIndicatorModule {}
