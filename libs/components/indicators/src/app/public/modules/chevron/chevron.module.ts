import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import { SkyChevronComponent } from './chevron.component';

@NgModule({
  declarations: [SkyChevronComponent],
  imports: [
    CommonModule,
    SkyI18nModule
  ],
  exports: [SkyChevronComponent]
})
export class SkyChevronModule { }
