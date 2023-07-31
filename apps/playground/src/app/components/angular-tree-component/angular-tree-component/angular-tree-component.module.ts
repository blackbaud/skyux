import { TreeModule } from '@ali-hm/angular-tree-component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
