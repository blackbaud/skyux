import { NgModule } from '@angular/core';

import { TextExpandRoutingModule } from './text-expand-routing.module';

@NgModule({
  imports: [TextExpandRoutingModule],
})
export class TextExpandModule {
  public static routes = TextExpandRoutingModule.routes;
}
