import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FieldGroupRoutingModule } from './field-group-routing.module';
import { FieldGroupComponent } from './field-group.component';

const routes: Routes = [{ path: '', component: FieldGroupComponent }];

@NgModule({
  imports: [
    FieldGroupRoutingModule,
    FieldGroupComponent,
    RouterModule.forChild(routes),
  ],
})
export class FieldGroupModule {
  public static routes = FieldGroupRoutingModule.routes;
}
