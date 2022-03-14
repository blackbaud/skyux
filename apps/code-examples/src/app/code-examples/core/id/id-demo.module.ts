import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';

import { IdDemoComponent } from './id-demo.component';

@NgModule({
  imports: [CommonModule, SkyIdModule, SkyInputBoxModule],
  declarations: [IdDemoComponent],
  exports: [IdDemoComponent],
})
export class IdDemoModule {}
