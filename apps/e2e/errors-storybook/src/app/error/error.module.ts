import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyErrorModule } from '@skyux/errors';
import { SkyButton } from '@skyux/forms';
import { SkyBoxModule } from '@skyux/layout';

import { ErrorComponent } from './error.component';

const routes: Routes = [{ path: '', component: ErrorComponent }];
@NgModule({
  declarations: [ErrorComponent],
  imports: [
    SkyButton,
    CommonModule,
    RouterModule.forChild(routes),
    SkyBoxModule,
    SkyErrorModule,
  ],
  exports: [ErrorComponent],
})
export class ErrorModule {}
