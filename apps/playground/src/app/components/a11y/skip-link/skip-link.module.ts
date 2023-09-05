import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAppLinkModule } from '@skyux/router';

import { SkipLinkRoutingModule } from './skip-link-routing.module';
import { SkipLinkComponent } from './skip-link.component';

@NgModule({
  declarations: [SkipLinkComponent],
  imports: [CommonModule, SkyAppLinkModule, SkipLinkRoutingModule],
})
export class SkipLinkModule {
  public static routes = SkipLinkRoutingModule.routes;
}
