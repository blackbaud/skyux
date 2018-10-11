import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyI18nModule } from '@skyux/i18n/modules/i18n';
import { SkyTextExpandRepeaterComponent } from './text-expand-repeater.component';

@NgModule({
  declarations: [
    SkyTextExpandRepeaterComponent
  ],
  imports: [
    SkyI18nModule,
    CommonModule
  ],
  exports: [
    SkyTextExpandRepeaterComponent
  ]
})
export class SkyTextExpandRepeaterModule { }
