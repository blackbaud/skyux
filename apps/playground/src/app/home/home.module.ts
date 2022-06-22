import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyActionButtonModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { HomeFiltersModalDemoComponent as HomeFiltersComponent } from './home-filter.component';
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
  declarations: [HomeComponent, HomeFiltersComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SkyActionButtonModule,
    SkyDataManagerModule,
    SkyModalModule,
    SkyRepeaterModule,
  ],
})
export class HomeModule {}
