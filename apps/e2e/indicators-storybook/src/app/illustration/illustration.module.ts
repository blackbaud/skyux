import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SkyIconModule,
  SkyIllustrationResolverService,
} from '@skyux/indicators';

import { IllustrationResolverService } from './illustration-resolver.service';
import { IllustrationComponent } from './illustration.component';

const routes: Routes = [{ path: '', component: IllustrationComponent }];
@NgModule({
  imports: [
    CommonModule,
    IllustrationComponent,
    RouterModule.forChild(routes),
    SkyIconModule,
  ],
  providers: [
    {
      provide: SkyIllustrationResolverService,
      useClass: IllustrationResolverService,
    },
  ],
  exports: [IllustrationComponent],
})
export class IllustrationModule {}
