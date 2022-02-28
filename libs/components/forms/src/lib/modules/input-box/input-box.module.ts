import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyInputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [SkyInputBoxComponent],
  imports: [CommonModule, SkyThemeModule],
  exports: [SkyInputBoxComponent],
})
export class SkyInputBoxModule {}
