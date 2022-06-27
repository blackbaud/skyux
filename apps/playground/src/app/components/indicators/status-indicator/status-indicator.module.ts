import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SkyHelpInlineModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

import { StatusIndicatorRoutingModule } from './status-indicator-routing.module';
import { StatusIndicatorComponent } from './status-indicator.component';

const routes: Routes = [{ path: '', component: StatusIndicatorComponent }];

@NgModule({
  declarations: [StatusIndicatorComponent],
  imports: [
    CommonModule,
    StatusIndicatorRoutingModule,
    RouterModule.forChild(routes),
    SkyHelpInlineModule,
    SkyStatusIndicatorModule,
  ],
})
export class StatusIndicatorModule {}
