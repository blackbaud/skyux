import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyDescriptionListModule } from '@skyux/layout';

import { DescriptionListComponent } from './description-list.component';

const routes: Routes = [{ path: '', component: DescriptionListComponent }];
@NgModule({
  declarations: [DescriptionListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyDescriptionListModule,
  ],
  exports: [DescriptionListComponent],
})
export class DescriptionListModule {}
