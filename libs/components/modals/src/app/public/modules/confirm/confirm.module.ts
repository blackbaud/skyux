import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyModalModule } from '../modal';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyConfirmService } from './confirm.service';
import { SkyConfirmComponent } from './confirm.component';

@NgModule({
  declarations: [
    SkyConfirmComponent
  ],
  imports: [
    CommonModule,
    SkyModalModule,
    SkyI18nModule
  ],
  exports: [
    SkyConfirmComponent
  ],
  providers: [
    SkyConfirmService
  ],
  entryComponents: [
    SkyConfirmComponent
  ]
})
export class SkyConfirmModule { }
