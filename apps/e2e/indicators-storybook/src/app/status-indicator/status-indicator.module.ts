import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { StatusIndicatorComponent } from './status-indicator.component';

const routes: Routes = [{ path: '', component: StatusIndicatorComponent }];
@NgModule({
  declarations: [StatusIndicatorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyHelpInlineModule,
    SkyStatusIndicatorModule,
  ],
  exports: [StatusIndicatorComponent],
})
export class StatusIndicatorModule {}
