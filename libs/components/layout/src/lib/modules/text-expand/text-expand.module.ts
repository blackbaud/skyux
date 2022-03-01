import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyModalModule } from '@skyux/modals';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyTextExpandModalComponent } from './text-expand-modal.component';
import { SkyTextExpandComponent } from './text-expand.component';

@NgModule({
  declarations: [SkyTextExpandComponent, SkyTextExpandModalComponent],
  imports: [
    SkyI18nModule,
    SkyLayoutResourcesModule,
    SkyModalModule,
    CommonModule,
  ],
  exports: [SkyTextExpandComponent],
  entryComponents: [SkyTextExpandModalComponent],
})
export class SkyTextExpandModule {}
