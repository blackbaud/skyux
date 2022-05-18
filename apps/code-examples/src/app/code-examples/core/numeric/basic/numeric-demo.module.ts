import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyNumericModule } from '@skyux/core';
import { SkyDescriptionListModule } from '@skyux/layout';

import { NumericDemoComponent } from './numeric-demo.component';

@NgModule({
  imports: [CommonModule, SkyDescriptionListModule, SkyNumericModule],
  declarations: [NumericDemoComponent],
  exports: [NumericDemoComponent],
})
export class NumericDemoModule {}
