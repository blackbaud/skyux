import { NgModule } from '@angular/core';
import { SkyTokensModule } from '@skyux/indicators';

import { TokensRoutingModule } from './tokens-routing.module';
import { TokensComponent } from './tokens.component';

@NgModule({
  declarations: [TokensComponent],
  imports: [TokensRoutingModule, SkyTokensModule],
})
export class TokensModule {
  public static routes = TokensRoutingModule.routes;
}
