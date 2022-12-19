import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TreeModule } from '@circlon/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';

import { AngularTreeComponentRoutingModule } from './angular-tree-component-routing.module';
import { AngularTreeComponentComponent } from './angular-tree-component.component';

@NgModule({
  declarations: [AngularTreeComponentComponent],
  imports: [
    CommonModule,
    AngularTreeComponentRoutingModule,
    SkyAngularTreeModule,
    TreeModule,
  ],
})
export class AngularTreeComponentModule {
  public static routes = AngularTreeComponentRoutingModule.routes;
}
