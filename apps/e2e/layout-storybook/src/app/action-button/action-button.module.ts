import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyActionButtonModule } from '@skyux/layout';
import { SkyModalModule } from '@skyux/modals';

import { ActionButtonComponent } from './action-button.component';

const routes: Routes = [{ path: '', component: ActionButtonComponent }];
@NgModule({
  declarations: [ActionButtonComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyActionButtonModule,
    SkyModalModule,
  ],
  exports: [ActionButtonComponent],
})
export class ActionButtonModule {}
