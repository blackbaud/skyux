import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DescriptionListComponent } from './description-list.component';

const routes: Routes = [{ path: '', component: DescriptionListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescriptionListRoutingModule {}
