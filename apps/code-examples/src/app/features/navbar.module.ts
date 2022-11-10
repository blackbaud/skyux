import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavbarDemoComponent } from '../code-examples/navbar/navbar/navbar-demo.component';
import { NavbarDemoModule } from '../code-examples/navbar/navbar/navbar-demo.module';

const routes: Routes = [
  {
    path: 'navbar',
    component: NavbarDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarFeatureRoutingModule {}

@NgModule({
  imports: [NavbarFeatureRoutingModule, NavbarDemoModule],
})
export class NavbarFeatureModule {}
