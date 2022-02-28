import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkySelectFieldModule } from '@skyux/select-field';

import { SelectFieldDemoComponent } from './select-field-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkySelectFieldModule,
  ],
  declarations: [SelectFieldDemoComponent],
  exports: [SelectFieldDemoComponent],
})
export class SelectFieldDemoModule {}
