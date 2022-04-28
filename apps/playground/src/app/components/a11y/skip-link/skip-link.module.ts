import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkySkipLinkModule } from '@skyux/a11y';
import { SkyAppLinkModule } from '@skyux/router';

import { SkipLinkRoutingModule } from './skip-link-routing.module';
import { SkipLinkComponent } from './skip-link.component';

@NgModule({
  declarations: [SkipLinkComponent],
  imports: [
    CommonModule,
    SkyAppLinkModule,
    SkySkipLinkModule,
    SkipLinkRoutingModule,
  ],
})
export class SkipLinkModule {}
