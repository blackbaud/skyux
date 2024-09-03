import { NgModule } from '@angular/core';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';

import { AngularTreeComponentRoutingModule } from './angular-tree-component-routing.module';
import { AngularTreeComponentComponent } from './angular-tree-component.component';

@NgModule({
  declarations: [AngularTreeComponentComponent],
  imports: [
    AngularTreeComponentRoutingModule,
    SkyAngularTreeModule,
    TreeModule,
  ],
})
export class AngularTreeComponentModule {
  public static routes = AngularTreeComponentRoutingModule.routes;
}
