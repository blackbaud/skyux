import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

import { IllustrationResolverService } from './illustration-resolver.service';
import { IllustrationRoutingModule } from './illustration-routing.module';
import { IllustrationComponent } from './illustration.component';

@NgModule({
  imports: [IllustrationComponent, IllustrationRoutingModule],
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: IllustrationResolverService,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class IllustrationModule {
  public static routes = IllustrationRoutingModule.routes;
}
