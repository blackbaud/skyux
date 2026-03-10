import { NgModule } from '@angular/core';
import { SkyTextExpandModule } from '@skyux/layout';

import { TextExpandRoutingModule } from './text-expand-routing.module';
import { TextExpandComponent } from './text-expand.component';

@NgModule({
  imports: [TextExpandComponent, TextExpandRoutingModule, SkyTextExpandModule],
})
export class TextExpandModule {
  public static routes = TextExpandRoutingModule.routes;
}
