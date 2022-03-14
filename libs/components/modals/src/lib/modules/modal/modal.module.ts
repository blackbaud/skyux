import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyModalsResourcesModule } from '../shared/sky-modals-resources.module';

import { SkyModalContentComponent } from './modal-content.component';
import { SkyModalFooterComponent } from './modal-footer.component';
import { SkyModalHeaderComponent } from './modal-header.component';
import { SkyModalHostComponent } from './modal-host.component';
import { SkyModalScrollShadowDirective } from './modal-scroll-shadow.directive';
import { SkyModalComponent } from './modal.component';

@NgModule({
  declarations: [
    SkyModalComponent,
    SkyModalContentComponent,
    SkyModalFooterComponent,
    SkyModalHeaderComponent,
    SkyModalHostComponent,
    SkyModalScrollShadowDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyIconModule,
    SkyModalsResourcesModule,
    SkyThemeModule,
  ],
  exports: [
    SkyModalComponent,
    SkyModalContentComponent,
    SkyModalFooterComponent,
    SkyModalHeaderComponent,
  ],
  entryComponents: [SkyModalHostComponent],
})
export class SkyModalModule {}
