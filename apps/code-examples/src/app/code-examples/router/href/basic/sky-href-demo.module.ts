import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyHrefModule } from '@skyux/router';

import { CustomSkyHrefResolverComponent } from './custom-resolver/custom-sky-href-resolver.component';
import { SkyHrefDemoComponent } from './sky-href-demo.component';

@NgModule({
  declarations: [SkyHrefDemoComponent, CustomSkyHrefResolverComponent],
  imports: [CommonModule, SkyHrefModule, SkyIdModule],
  exports: [SkyHrefDemoComponent],
})
export class SkyHrefDemoModule {}
