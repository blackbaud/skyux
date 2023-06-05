import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyErrorModule } from '@skyux/errors';
import { SkyBoxModule } from '@skyux/layout';

import { ErrorComponent } from './error.component';

const routes: Routes = [{ path: '', component: ErrorComponent }];
@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyBoxModule,
    SkyErrorModule,
  ],
  exports: [ErrorComponent],
})
export class ErrorModule {}
