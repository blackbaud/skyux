import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SkyIconClassListPipe } from './icon-class-list.pipe';
import { SkyIconStackComponent } from './icon-stack.component';
import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconSvgComponent } from './icon-svg.component';
import { SkyIconComponent } from './icon.component';

@NgModule({
  declarations: [SkyIconClassListPipe, SkyIconComponent, SkyIconStackComponent],
  imports: [CommonModule, SkyIconSvgComponent],
  exports: [SkyIconComponent, SkyIconStackComponent],
  providers: [
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    SkyIconSvgResolverService,
  ],
})
export class SkyIconModule {}
