import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHrefModule, SkyHrefResolverService } from '@skyux/router';

import { CustomSkyHrefResolverService } from './custom-resolver/custom-sky-href-resolver.service';
import { SkyHrefDemoComponent } from './sky-href-demo.component';

@NgModule({
  declarations: [SkyHrefDemoComponent],
  imports: [CommonModule, SkyHrefModule],
  exports: [SkyHrefDemoComponent],
  providers: [
    {
      provide: SkyHrefResolverService,
      useClass: CustomSkyHrefResolverService,
    },
  ],
})
export class SkyHrefDemoModule {}
