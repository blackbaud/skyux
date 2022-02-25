import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyIdModule } from '@skyux/core';

import { SkyInputBoxModule } from '@skyux/forms';

import { IdDemoComponent } from './id-demo.component';

@NgModule({
  imports: [CommonModule, SkyIdModule, SkyInputBoxModule],
  declarations: [IdDemoComponent],
  exports: [IdDemoComponent],
})
export class IdDemoModule {}
