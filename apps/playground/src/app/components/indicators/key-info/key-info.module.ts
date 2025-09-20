import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoRoutingModule } from './key-info-routing.module';
import { KeyInfoComponent } from './key-info.component';

@NgModule({
  declarations: [KeyInfoComponent],
  imports: [
    KeyInfoRoutingModule,
    SkyHelpInlineModule,
    SkyKeyInfoModule,
    FormsModule,
  ],
})
export class KeyInfoModule {
  public static routes = KeyInfoRoutingModule.routes;
}
