import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyExpansionIndicatorModule } from '@skyux/indicators';

import { ExpansionIndicatorComponent } from './expansion-indicator.component';

const routes: Routes = [{ path: '', component: ExpansionIndicatorComponent }];
@NgModule({
  declarations: [ExpansionIndicatorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyExpansionIndicatorModule,
  ],
  exports: [ExpansionIndicatorComponent],
})
export class ExpansionIndicatorModule {}
