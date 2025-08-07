import { NgModule } from '@angular/core';

import { SelectionBoxRoutingModule } from './selection-box-routing.module';
import { SelectionBoxComponent } from './selection-box.component';

@NgModule({
  imports: [SelectionBoxComponent, SelectionBoxRoutingModule],
})
export class SelectionBoxModule {
  public static routes = SelectionBoxRoutingModule.routes;
}
