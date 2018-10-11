import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyI18nModule } from '@skyux/i18n/modules/i18n';
import { SkyTextExpandComponent } from './text-expand.component';
import { SkyModalModule } from '@skyux/modals/modules/modal';
import { SkyTextExpandModalComponent } from './text-expand-modal.component';

@NgModule({
  declarations: [
    SkyTextExpandComponent,
    SkyTextExpandModalComponent
  ],
  imports: [
    SkyI18nModule,
    SkyModalModule,
    CommonModule
  ],
  exports: [
    SkyTextExpandComponent
  ],
  entryComponents: [
    SkyTextExpandModalComponent
  ]
})
export class SkyTextExpandModule { }
