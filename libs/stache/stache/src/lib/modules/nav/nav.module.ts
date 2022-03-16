import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StacheAuthService } from '../auth/auth.service';
import { StacheRouterModule } from '../router/router.module';
import { StacheResourcesModule } from '../shared/stache-resources.module';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheRouterLinkDirective } from './link.directive';
import { StacheNavComponent } from './nav.component';
import { StacheNavService } from './nav.service';

@NgModule({
  declarations: [StacheNavComponent, StacheRouterLinkDirective],
  imports: [
    CommonModule,
    RouterModule,
    StacheResourcesModule,
    StacheRouterModule,
  ],
  exports: [StacheNavComponent, StacheRouterLinkDirective],
  providers: [StacheAuthService, StacheNavService, StacheWindowRef],
})
export class StacheNavModule {}
