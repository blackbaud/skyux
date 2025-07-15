import { NgModule } from '@angular/core';
import { SkyCardModule } from '@skyux/layout';

import { CardRoutingModule } from './card-routing.module';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [CardComponent],
  imports: [CardRoutingModule, SkyCardModule],
})
export class CardModule {
  public static routes = CardRoutingModule.routes;
}
