import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyModalModule } from '../modal/modal.module';
import { SkyModalsResourcesModule } from '../shared/sky-modals-resources.module';

import { SkyConfirmComponent } from './confirm.component';

@NgModule({
  declarations: [SkyConfirmComponent],
  imports: [
    CommonModule,
    SkyModalModule,
    SkyModalsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyConfirmComponent],
})
export class SkyConfirmModule {}
