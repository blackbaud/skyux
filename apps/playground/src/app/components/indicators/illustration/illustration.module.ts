import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

import { IllustrationResolverService } from './illustration-resolver.service';
import { IllustrationRoutingModule } from './illustration-routing.module';
import { IllustrationComponent } from './illustration.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IllustrationComponent,
    IllustrationRoutingModule,
  ],
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: IllustrationResolverService,
    },
  ],
})
export class IllustrationModule {
  public static routes = IllustrationRoutingModule.routes;
}
