import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyActionButtonModule } from '@skyux/layout';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

@NgModule({
  declarations: [HomeComponent],
  imports: [HomeRoutingModule, SkyActionButtonModule, SkyDataManagerModule],
})
export class HomeModule {}
