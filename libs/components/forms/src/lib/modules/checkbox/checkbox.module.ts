import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyCheckboxLabelComponent } from './checkbox-label.component';
import { SkyCheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [SkyCheckboxComponent, SkyCheckboxLabelComponent],
  imports: [CommonModule, FormsModule, SkyIconModule, SkyTrimModule],
  exports: [SkyCheckboxComponent, SkyCheckboxLabelComponent],
})
export class SkyCheckboxModule {}
